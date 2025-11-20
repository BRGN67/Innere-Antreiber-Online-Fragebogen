import React, { useState } from 'react';
import { TestRunner } from './components/TestRunner';
import { ResultView } from './components/ResultView';
import { IntroView } from './components/IntroView';
import { TestState, DriverScores } from './types';
import { calculateScores } from './utils/scoring';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'intro' | 'test' | 'results'>('intro');
  const [answers, setAnswers] = useState<number[]>([]);
  const [scores, setScores] = useState<DriverScores | null>(null);
  const [logoError, setLogoError] = useState(false);

  const startTest = () => {
    setCurrentView('test');
    setAnswers([]);
    setScores(null);
  };

  const handleTestComplete = (finalAnswers: number[]) => {
    setAnswers(finalAnswers);
    const calculated = calculateScores(finalAnswers);
    setScores(calculated);
    setCurrentView('results');
  };

  const retakeTest = () => {
    setCurrentView('intro');
    setAnswers([]);
    setScores(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!logoError ? (
              <img 
                src="https://file-service-full-268333769264.us-central1.run.app/static/6543df07-b4f2-475d-956c-9428d04bd795.png" 
                alt="JAP2 Consulting & Coaching" 
                className="h-12 w-auto object-contain" 
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="flex flex-col leading-none select-none">
                <span className="font-extrabold text-3xl text-slate-800 tracking-tighter">
                    JAP<sup className="text-orange-500 text-lg">2</sup>
                </span>
              </div>
            )}
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <span className="font-semibold text-lg tracking-tight text-slate-700 hidden sm:block">Innerer Antreiber Coach</span>
          </div>
          {currentView !== 'intro' && (
            <button 
              onClick={retakeTest}
              className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors px-3 py-1 rounded-md hover:bg-slate-50"
            >
              Neustart
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 min-h-[600px] flex flex-col">
          {currentView === 'intro' && <IntroView onStart={startTest} />}
          {currentView === 'test' && <TestRunner onComplete={handleTestComplete} />}
          {currentView === 'results' && scores && <ResultView scores={scores} />}
        </div>
      </main>

      <footer className="py-6 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} JAP² Consulting & Coaching. Powered by Gemini Native Audio.</p>
      </footer>
    </div>
  );
};

export default App;