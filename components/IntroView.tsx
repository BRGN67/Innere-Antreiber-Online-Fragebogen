import React, { useState } from 'react';

interface IntroViewProps {
  onStart: () => void;
}

export const IntroView: React.FC<IntroViewProps> = ({ onStart }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col h-full p-8 md:p-12 text-center justify-center items-center bg-gradient-to-br from-white to-blue-50">
      <div className="mb-8 flex flex-col items-center">
        {!imgError ? (
          <img 
            src="https://file-service-full-268333769264.us-central1.run.app/static/6543df07-b4f2-475d-956c-9428d04bd795.png" 
            alt="JAP2 Consulting & Coaching" 
            className="h-32 w-auto object-contain mb-8" 
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="mb-8 flex flex-col items-center select-none">
            <div className="font-extrabold text-7xl text-slate-800 tracking-tighter mb-2">
                JAP<sup className="text-orange-500 text-4xl">2</sup>
            </div>
            <div className="text-slate-400 text-sm tracking-[0.2em] uppercase font-semibold">Consulting & Coaching</div>
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
          Was treibt dich an?
        </h1>
        <h2 className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Entdecke deine unbewussten Verhaltensmuster mit dem JAP² Business-Coaching-Test.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-10 w-full">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="text-blue-600 font-bold text-lg mb-2">50 Fragen</div>
          <p className="text-slate-500 text-sm">Wissenschaftlich fundierter Fragebogen zur Selbsteinschätzung.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="text-blue-600 font-bold text-lg mb-2">5 Antreiber</div>
          <p className="text-slate-500 text-sm">Analyse der fünf klassischen psychologischen Antreiber.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="text-purple-600 font-bold text-lg mb-2">Live KI-Coach</div>
          <p className="text-slate-500 text-sm">Besprich deine Ergebnisse danach direkt mit unserem KI-Coach.</p>
        </div>
      </div>

      <button
        onClick={onStart}
        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-full shadow-lg shadow-blue-200 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200"
      >
        Test jetzt starten
      </button>
      <p className="mt-4 text-xs text-slate-400">Dauer: ca. 10 Minuten</p>
    </div>
  );
};