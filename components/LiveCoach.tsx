import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { DriverScores } from '../types';
import { createPcmBlob, base64ToUint8Array, decodeAudioData } from '../utils/audioUtils';

interface LiveCoachProps {
  scores: DriverScores;
}

export const LiveCoach: React.FC<LiveCoachProps> = ({ scores }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for audio management
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startSession = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API Key not found in environment variables.");
      }

      // Initialize Audio Contexts
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      outputNodeRef.current = outputAudioContextRef.current.createGain();
      outputNodeRef.current.connect(outputAudioContextRef.current.destination);

      // Get Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ai = new GoogleGenAI({ apiKey });

      // System Instruction with Scores
      const scoreSummary = Object.entries(scores)
        .map(([driver, score]) => `${driver}: ${score}/50`)
        .join(', ');

      const systemInstruction = `
        Du bist ein erfahrener, empathischer Business Coach (Systemischer Ansatz).
        Dein Klient hat gerade einen Test zu den "Inneren Antreibern" gemacht.
        Hier sind die Ergebnisse: ${scoreSummary}.
        
        Eine Punktzahl über 40 ist sehr hoch, über 30 ist hoch.
        Deine Aufgabe:
        1. Helfe dem Klienten, die Ergebnisse zu reflektieren.
        2. Frage, welcher Antreiber ihn am meisten belastet.
        3. Gib kurze, prägnante Tipps, wie er Erlaubnissätze nutzen kann.
        4. Sei freundlich, professionell, aber locker. Sprich Deutsch.
        
        Halte deine Antworten kurz und gesprächsorientiert (max 2-3 Sätze am Stück), damit ein Dialog entsteht.
      `;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);

            if (!inputAudioContextRef.current || !streamRef.current) return;

            // Setup Input Processing
            const source = inputAudioContextRef.current.createMediaStreamSource(streamRef.current);
            inputSourceRef.current = source;
            
            // Using ScriptProcessor as per provided guidelines (AudioWorklet is modern standard but guidelines used SP)
            const processor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = processor;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData, 16000); // Input expects 16k
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            
            if (base64Audio && outputAudioContextRef.current && outputNodeRef.current) {
              setIsTalking(true);
              const ctx = outputAudioContextRef.current;
              
              // Ensure continuous playback
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);

              try {
                const audioBuffer = await decodeAudioData(
                  base64ToUint8Array(base64Audio),
                  ctx,
                  24000, // Output is 24k
                  1
                );

                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputNodeRef.current);
                
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                  if (sourcesRef.current.size === 0) setIsTalking(false);
                });

                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              } catch (err) {
                console.error("Decoding error", err);
              }
            }

            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsTalking(false);
            }
          },
          onclose: () => {
            setIsActive(false);
            setIsConnecting(false);
          },
          onerror: (e) => {
            console.error("Session error", e);
            setError("Verbindung unterbrochen.");
            stopSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: systemInstruction,
        }
      });

      sessionRef.current = sessionPromise;

    } catch (err: any) {
      console.error("Connection failed", err);
      setError(err.message || "Konnte keine Verbindung herstellen.");
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    // Clean up WebAudio
    if (scriptProcessorRef.current) scriptProcessorRef.current.disconnect();
    if (inputSourceRef.current) inputSourceRef.current.disconnect();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();

    if (inputAudioContextRef.current) inputAudioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();

    // Close Session
    if (sessionRef.current) {
        sessionRef.current.then((s: any) => s.close());
    }

    setIsActive(false);
    setIsTalking(false);
    setIsConnecting(false);
  };

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  return (
    <div className="bg-slate-900 rounded-xl p-6 text-white flex flex-col items-center justify-center shadow-2xl overflow-hidden relative">
      {/* Background Pulse Animation */}
      {isTalking && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
          <div className="w-48 h-48 bg-purple-500 rounded-full opacity-10 animate-ping animation-delay-200"></div>
        </div>
      )}

      <h3 className="text-xl font-bold mb-2 relative z-10">KI-Coach Live</h3>
      <p className="text-slate-300 text-center mb-6 text-sm max-w-md relative z-10">
        Starte das Gespräch, um deine Ergebnisse zu diskutieren. Der Coach kennt deine Werte.
      </p>

      {error && (
        <div className="mb-4 p-2 bg-red-500/20 border border-red-500 rounded text-red-200 text-xs">
          {error}
        </div>
      )}

      {!isActive ? (
        <button
          onClick={startSession}
          disabled={isConnecting}
          className={`
            relative z-10 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105
            ${isConnecting 
              ? "bg-slate-700 text-slate-400 cursor-wait" 
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"}
          `}
        >
          {isConnecting ? "Verbinde..." : "Gespräch starten"}
        </button>
      ) : (
        <div className="flex flex-col items-center relative z-10">
          <div className="flex items-center gap-4 mb-6">
             <div className="flex gap-1 h-8 items-end">
                {/* Fake equalizer visualization */}
                <div className={`w-2 bg-blue-400 rounded-full transition-all duration-100 ${isTalking ? 'h-8 animate-pulse' : 'h-2'}`}></div>
                <div className={`w-2 bg-purple-400 rounded-full transition-all duration-150 ${isTalking ? 'h-6 animate-pulse' : 'h-2'}`}></div>
                <div className={`w-2 bg-blue-400 rounded-full transition-all duration-200 ${isTalking ? 'h-8 animate-pulse' : 'h-2'}`}></div>
                <div className={`w-2 bg-purple-400 rounded-full transition-all duration-100 ${isTalking ? 'h-5 animate-pulse' : 'h-2'}`}></div>
             </div>
             <span className="font-mono text-blue-300">{isTalking ? "Coach spricht..." : "Höre zu..."}</span>
          </div>

          <button
            onClick={stopSession}
            className="px-6 py-2 rounded-full border border-red-500/50 text-red-300 hover:bg-red-500/20 transition-colors text-sm"
          >
            Gespräch beenden
          </button>
        </div>
      )}
    </div>
  );
};
