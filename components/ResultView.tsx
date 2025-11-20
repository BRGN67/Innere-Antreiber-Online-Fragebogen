import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { jsPDF } from 'jspdf';
import { DriverScores, DriverType } from '../types';
import { DRIVER_DESCRIPTIONS } from '../constants';
import { LiveCoach } from './LiveCoach';

interface ResultViewProps {
  scores: DriverScores;
}

export const ResultView: React.FC<ResultViewProps> = ({ scores }) => {
  const data = Object.entries(scores).map(([driver, score]) => ({
    driver,
    score: score as number,
    fullMark: 50,
  }));

  // Determine dominant driver
  const dominantDriverEntry = Object.entries(scores).reduce((a, b) => (a[1] as number) > (b[1] as number) ? a : b);
  const dominantDriver = dominantDriverEntry[0] as DriverType;
  const dominantScore = dominantDriverEntry[1] as number;
  const dominantInfo = DRIVER_DESCRIPTIONS[dominantDriver];

  const getColor = (score: number) => {
    if (score >= 40) return '#ef4444'; // High - Red
    if (score >= 30) return '#f59e0b'; // Med - Amber
    return '#10b981'; // Low - Green
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const MARGIN = 20;
    const CONTENT_WIDTH = 170;
    let y = 20;

    // Helper to check page break
    const checkPageBreak = (heightNeeded: number) => {
      if (y + heightNeeded > 280) {
        doc.addPage();
        y = 20;
        return true;
      }
      return false;
    };

    // Helper for wrapped text
    const addWrappedText = (text: string, fontSize: number, fontType: string, color: string = '#1e293b', indent: number = 0) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", fontType);
      doc.setTextColor(color);
      const lines = doc.splitTextToSize(text, CONTENT_WIDTH - indent);
      checkPageBreak(lines.length * (fontSize * 0.4) + 5);
      doc.text(lines, MARGIN + indent, y);
      y += lines.length * (fontSize * 0.4) + 5;
    };

    // --- HEADER ---
    doc.setFillColor(37, 99, 235); // Blue-600
    doc.rect(0, 0, 210, 15, 'F');
    
    doc.setFontSize(22);
    doc.setTextColor('#1e293b');
    doc.setFont("helvetica", "bold");
    doc.text("Persönliches Antreiber-Profil", MARGIN, 35);
    y = 45;

    doc.setFontSize(10);
    doc.setTextColor('#64748b');
    doc.setFont("helvetica", "normal");
    doc.text(`Erstellt am: ${new Date().toLocaleDateString('de-DE')}`, MARGIN, y);
    y += 15;

    addWrappedText("Dieser Bericht analysiert Ihre inneren Antreiber basierend auf dem Business-Coaching-Modell der Transaktionsanalyse. Er bietet Ihnen Einblicke in Ihre Verhaltensmuster sowie konkrete Entwicklungsstrategien.", 10, "normal");
    y += 10;

    // --- SUMMARY CHART ---
    doc.setFontSize(14);
    doc.setTextColor('#1e293b');
    doc.setFont("helvetica", "bold");
    doc.text("Ergebnisübersicht", MARGIN, y);
    y += 10;

    const sortedScores = Object.entries(scores).sort(([, a], [, b]) => (b as number) - (a as number));

    sortedScores.forEach(([key, value]) => {
      const score = value as number;
      const driverName = key as DriverType;
      
      checkPageBreak(15);

      // Label
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor('#334155');
      doc.text(`${driverName} (${score}/50)`, MARGIN, y);

      // Bar Background
      doc.setFillColor('#f1f5f9');
      doc.rect(MARGIN + 60, y - 4, 100, 5, 'F');

      // Score Bar
      if (score >= 40) doc.setFillColor('#ef4444');
      else if (score >= 30) doc.setFillColor('#f59e0b');
      else doc.setFillColor('#10b981');
      
      const barWidth = (score / 50) * 100;
      doc.rect(MARGIN + 60, y - 4, barWidth, 5, 'F');

      y += 10;
    });

    y += 10;

    // --- DETAILED ANALYSIS ---
    addWrappedText("Detaillierte Analyse & Coaching-Impulse", 16, "bold", "#2563eb");
    y += 5;
    doc.setDrawColor(200, 200, 200);
    doc.line(MARGIN, y, MARGIN + CONTENT_WIDTH, y);
    y += 10;

    sortedScores.forEach(([key, value], index) => {
      const score = value as number;
      const driverType = key as DriverType;
      const info = DRIVER_DESCRIPTIONS[driverType];
      
      // Only show details for top 3 or scores > 25 to keep report focused
      if (score < 25 && index > 2) return;

      checkPageBreak(80);

      // Driver Header
      doc.setFillColor('#f8fafc');
      doc.rect(MARGIN - 5, y - 6, CONTENT_WIDTH + 10, 16, 'F');
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor('#0f172a');
      doc.text(`${index + 1}. ${info.title} - ${score} Punkte`, MARGIN, y);
      y += 16;

      // Slogan
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.setTextColor('#64748b');
      doc.text(`"${info.slogan}"`, MARGIN, y);
      y += 10;

      // Content Grid
      const colWidth = (CONTENT_WIDTH / 2) - 5;
      
      // Left Col: Strength & Risk
      const startY = y;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor('#166534'); // Green
      doc.text("Ihre Stärke (Ressource):", MARGIN, y);
      y += 5;
      addWrappedText(info.gift, 10, "normal", "#334155");
      
      y += 5;
      doc.setFont("helvetica", "bold");
      doc.setTextColor('#b91c1c'); // Red
      doc.text("Ihr Risiko (Gefahr):", MARGIN, y);
      y += 5;
      addWrappedText(info.danger, 10, "normal", "#334155");
      y += 8;

      // Right Col: Strategy (simulated by just continuing down for mobile-friendly PDF flow, but styled distinctly)
      doc.setFont("helvetica", "bold");
      doc.setTextColor('#2563eb'); // Blue
      doc.text("Coaching-Strategie:", MARGIN, y);
      y += 5;
      addWrappedText(info.strategy, 10, "normal", "#1e293b");
      
      y += 5;
      doc.setFont("helvetica", "bold");
      doc.setTextColor('#7c3aed'); // Purple
      doc.text("Erlaubnissatz (Mantra):", MARGIN, y);
      y += 5;
      doc.setFont("helvetica", "italic");
      addWrappedText(`"${info.permission}"`, 10, "italic", "#4b5563");
      
      y += 5;
      doc.setFont("helvetica", "bold");
      doc.setTextColor('#ea580c'); // Orange
      doc.text("Reflexionsfrage:", MARGIN, y);
      y += 5;
      addWrappedText(info.coachingQuestion, 10, "normal", "#1e293b");

      y += 15; // Spacer between drivers
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor('#94a3b8');
      doc.text(`Seite ${i} von ${pageCount} - Generiert mit Innerer Antreiber Coach`, MARGIN, 290);
    }

    doc.save("antreiber-profil-coaching.pdf");
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-slate-50">
      <div className="p-6 md:p-8 bg-white border-b border-slate-200 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Ihre Auswertung</h2>
          <p className="text-slate-600">Analyse und Coaching-Impulse.</p>
        </div>
        <button 
          onClick={generatePDF}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-slate-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          PDF Report laden
        </button>
      </div>

      <div className="p-6 md:p-8 max-w-6xl mx-auto w-full space-y-10">
        
        {/* Coaching Focus Card - Highlighting the dominant driver */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-blue-200 font-semibold tracking-wide uppercase text-sm mb-3">
              Ihr dominanter Antreiber
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">{dominantInfo.title} ({dominantScore} Punkte)</h3>
            <p className="text-blue-100 text-lg max-w-3xl mb-8 leading-relaxed">
              "{dominantInfo.slogan}" - Diese innere Stimme prägt Ihr Handeln besonders stark. 
              Hier ist Ihr persönlicher Coaching-Fokus für die kommende Woche:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                <div className="font-bold text-blue-200 mb-2 text-sm uppercase">Ihr Mantra (Erlaubnis)</div>
                <div className="text-xl font-medium">"{dominantInfo.permission}"</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                <div className="font-bold text-blue-200 mb-2 text-sm uppercase">Strategie</div>
                <div className="text-base">{dominantInfo.strategy}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                <div className="font-bold text-blue-200 mb-2 text-sm uppercase">Reflexionsfrage</div>
                <div className="text-base italic">"{dominantInfo.coachingQuestion}"</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="h-80 w-full bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 text-center">Profil-Radar</h4>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="driver" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 50]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fill="#3b82f6"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="h-80 w-full bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex flex-col">
             <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Ergebnis-Details</h4>
             <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" domain={[0, 50]} hide />
                  <YAxis dataKey="driver" type="category" width={110} tick={{fontSize: 11, fill: '#475569'}} interval={0} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}} 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getColor(entry.score)} />
                    ))}
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
             <div className="flex justify-between text-xs text-slate-400 px-4 mt-2">
                <span>Gering (0-29)</span>
                <span>Mittel (30-39)</span>
                <span>Hoch (40-50)</span>
             </div>
          </div>
        </div>

        {/* Live Coach Integration */}
        <div className="my-8">
          <LiveCoach scores={scores} />
        </div>

        {/* Detailed Analysis List */}
        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-4">Detailanalyse aller Antreiber</h3>
          {Object.entries(scores)
            .sort(([, a], [, b]) => (b as number) - (a as number)) // Sort by score descending
            .map(([key, value]) => {
              const score = value as number;
              const type = key as DriverType;
              const info = DRIVER_DESCRIPTIONS[type];
              const intensity = score >= 40 ? 'Sehr stark ausgeprägt' : score >= 30 ? 'Stark ausgeprägt' : score >= 20 ? 'Mittel ausgeprägt' : 'Gering ausgeprägt';
              const intensityColor = score >= 40 ? 'text-red-600 bg-red-50' : score >= 30 ? 'text-amber-600 bg-amber-50' : 'text-green-600 bg-green-50';

              return (
                <div key={key} className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                        {info.title}
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${intensityColor} uppercase tracking-wide`}>
                          {score} / 50
                        </span>
                      </h4>
                      <p className="text-slate-500 italic mt-1">"{info.slogan}"</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Die Ressource (Stärke)</span>
                        <p className="text-slate-700 bg-green-50/50 p-3 rounded-lg border border-green-100">{info.gift}</p>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Die Gefahr (Risiko)</span>
                        <p className="text-slate-700 bg-red-50/50 p-3 rounded-lg border border-red-100">{info.danger}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                       <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Coaching-Strategie</span>
                        <p className="text-slate-700 bg-blue-50/50 p-3 rounded-lg border border-blue-100">{info.strategy}</p>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Erlaubnissatz</span>
                        <p className="text-slate-700 font-medium text-blue-700">"{info.permission}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
          })}
        </div>
      </div>
    </div>
  );
};