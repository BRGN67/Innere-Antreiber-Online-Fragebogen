import React, { useState, useEffect } from 'react';
import { QUESTIONS } from '../constants';

interface TestRunnerProps {
  onComplete: (answers: number[]) => void;
}

export const TestRunner: React.FC<TestRunnerProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // Use a record to store answers by index, allowing non-sequential updates
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // Scroll to top when question changes (helpful for mobile)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestionIndex]);

  const handleAnswer = (score: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: score }));

    // Auto-advance if not the last question
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(curr => curr + 1);
      }, 200);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(curr => curr - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(curr => curr + 1);
    }
  };

  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleFinish = () => {
    // Convert record to ordered array matching question indices
    const finalAnswers = QUESTIONS.map((_, idx) => answers[idx] || 0);
    onComplete(finalAnswers);
  };

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / QUESTIONS.length) * 100;
  const isComplete = answeredCount === QUESTIONS.length;
  const currentAnswer = answers[currentQuestionIndex];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full px-2 md:px-0">
      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-3 rounded-full mt-6 overflow-hidden shadow-inner">
        <div 
          className="bg-blue-600 h-full transition-all duration-500 ease-out rounded-r-full" 
          style={{ width: `${progress}%` }} 
        />
      </div>
      <div className="flex justify-between items-end mt-2 px-1">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Fortschritt
        </span>
        <span className="text-xs font-bold text-blue-600">
          {answeredCount} / {QUESTIONS.length}
        </span>
      </div>

      <div className="flex-grow flex flex-col items-center pt-8 pb-4">
        {/* Question Display */}
        <div className="mb-10 text-center w-full max-w-2xl">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider mb-4">
            Frage {currentQuestionIndex + 1}
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 leading-snug min-h-[80px] flex items-center justify-center">
            {currentQuestion.text}
          </h3>
        </div>

        {/* Answer Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 w-full mb-12">
          {[1, 2, 3, 4, 5].map((score) => {
            const isSelected = currentAnswer === score;
            return (
              <button
                key={score}
                onClick={() => handleAnswer(score)}
                className={`
                  py-5 px-2 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 relative
                  ${isSelected 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg transform scale-105 z-10' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700'
                  }
                `}
              >
                <span className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-slate-700'}`}>{score}</span>
                <span className={`text-[10px] md:text-xs uppercase tracking-wide font-semibold text-center leading-tight
                  ${isSelected ? 'text-blue-100' : 'text-slate-400'}
                `}>
                  {score === 1 && "Trifft gar nicht zu"}
                  {score === 2 && "Eher nicht"}
                  {score === 3 && "Teils / Teils"}
                  {score === 4 && "Eher ja"}
                  {score === 5 && "Trifft voll zu"}
                </span>
                
                {/* Visual checkmark for selected state */}
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Navigation Buttons */}
        <div className="w-full flex items-center justify-between mb-8">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2
              ${currentQuestionIndex === 0 
                ? 'text-slate-300 cursor-not-allowed' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 bg-white shadow-sm'}
            `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Zurück
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === QUESTIONS.length - 1}
               className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2
              ${currentQuestionIndex === QUESTIONS.length - 1 
                ? 'text-slate-300 cursor-not-allowed hidden' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 bg-white shadow-sm'}
            `}
            >
              Nächste Frage
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>

            {isComplete && (
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-lg shadow-lg shadow-green-200 transition-all transform hover:scale-105 flex items-center gap-2 animate-in fade-in slide-in-from-right-4"
              >
                Test abschließen
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator Grid */}
        <div className="w-full border-t border-slate-100 pt-6">
          <div className="flex items-center gap-2 mb-3">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fragen-Übersicht</span>
             <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Klicken zum Springen</span>
          </div>
          <div className="grid grid-cols-10 sm:grid-cols-10 gap-2 md:gap-3">
            {QUESTIONS.map((q, index) => {
              const isAnswered = answers[index] !== undefined;
              const isCurrent = index === currentQuestionIndex;
              
              return (
                <button
                  key={q.id}
                  onClick={() => jumpToQuestion(index)}
                  className={`
                    h-8 w-full rounded-md text-xs font-bold transition-all duration-200 flex items-center justify-center
                    ${isCurrent 
                      ? 'ring-2 ring-slate-800 ring-offset-2 bg-white border border-slate-300 text-slate-900 z-10' 
                      : isAnswered 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }
                  `}
                  title={`Frage ${q.id}${isAnswered ? ': Beantwortet' : ''}`}
                >
                  {q.id}
                </button>
              );
            })}
          </div>
          <div className="flex gap-4 mt-2 justify-end">
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <div className="w-3 h-3 rounded bg-slate-100"></div> Offen
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <div className="w-3 h-3 rounded bg-blue-500"></div> Beantwortet
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <div className="w-3 h-3 rounded border border-slate-300 bg-white ring-1 ring-slate-800"></div> Aktuell
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};