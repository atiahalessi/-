
import React, { useState } from 'react';
import { StudyMatrix } from '../types';

interface ExportSectionProps {
  studies: StudyMatrix[];
  isReadOnly?: boolean;
}

export const ExportSection: React.FC<ExportSectionProps> = ({ studies, isReadOnly }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const generateCSV = () => {
    const headers = [
      "اسم الدراسة", "مكان النشر", "تاريخ النشر", "مشكلة الدراسة", "أهداف الدراسة", 
      "أسئلة الدراسة", "حدود الدراسة الزمانية", "منهج الدراسة", "أداة الدراسة", 
      "حدود الدراسة المكانية", "أهم النتائج", "التوصيات", "المقترحات"
    ];

    const rows = studies.map(s => [
      `"${s.title.replace(/"/g, '""')}"`,
      `"${s.publicationVenue.replace(/"/g, '""')}"`,
      `"${s.publicationYear.replace(/"/g, '""')}"`,
      `"${s.researchProblem.replace(/"/g, '""')}"`,
      `"${s.objectives.replace(/"/g, '""')}"`,
      `"${s.questions.replace(/"/g, '""')}"`,
      `"${s.temporalLimits.replace(/"/g, '""')}"`,
      `"${s.methodology.replace(/"/g, '""')}"`,
      `"${s.tools.replace(/"/g, '""')}"`,
      `"${s.spatialLimits.replace(/"/g, '""')}"`,
      `"${s.keyResults.replace(/"/g, '""')}"`,
      `"${s.recommendations.replace(/"/g, '""')}"`,
      `"${s.suggestions.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    return csvContent;
  };

  const copyToClipboard = () => {
    const csv = generateCSV();
    navigator.clipboard.writeText(csv).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const downloadCSV = () => {
    const csv = generateCSV();
    const bom = '\uFEFF';
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `academic_matrix_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const shareMatrix = () => {
    try {
      // Encode studies array to a base64 string
      const jsonStr = JSON.stringify(studies);
      const encodedData = btoa(unescape(encodeURIComponent(jsonStr)));
      const shareUrl = `${window.location.origin}${window.location.pathname}#share=${encodedData}`;
      
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      });
    } catch (e) {
      console.error("Failed to generate share link", e);
      alert("عذراً، المصفوفة كبيرة جداً للمشاركة عبر الرابط المباشر.");
    }
  };

  return (
    <section className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl shadow-slate-200 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        <div>
          <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
            <i className="fa-solid fa-file-export text-indigo-400"></i>
            {isReadOnly ? 'تصدير هذه المصفوفة' : 'تصدير ومشاركة البيانات'}
          </h3>
          <p className="text-slate-400 max-w-lg">
            {isReadOnly 
              ? 'يمكنك تحميل هذه البيانات كملف Excel أو نسخها بتنسيق CSV.' 
              : 'قم بمشاركة نتائجك مع الزملاء أو تصديرها مباشرة لبرامج الجداول الحسابية.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {!isReadOnly && (
            <button 
              onClick={shareMatrix}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all border ${
                shareSuccess ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-transparent text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10 hover:border-indigo-400'
              }`}
            >
              <i className={`fa-solid ${shareSuccess ? 'fa-check' : 'fa-share-nodes'}`}></i>
              {shareSuccess ? 'تم نسخ رابط المشاركة!' : 'مشاركة المصفوفة (رابط)'}
            </button>
          )}

          <button 
            onClick={copyToClipboard}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all ${
              copySuccess ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <i className={`fa-solid ${copySuccess ? 'fa-check' : 'fa-copy'}`}></i>
            {copySuccess ? 'تم النسخ!' : 'نسخ CSV'}
          </button>
          
          <button 
            onClick={downloadCSV}
            className="flex items-center gap-3 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-900/40 transition-all active:scale-95"
          >
            <i className="fa-solid fa-download"></i>
            تحميل Excel (CSV)
          </button>
        </div>
      </div>

      <div className="mt-8 bg-slate-950/50 rounded-xl p-4 border border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">المعاينة (CSV)</span>
          <span className="text-[10px] text-slate-600">UTF-8 WITH BOM</span>
        </div>
        <pre className="text-[10px] font-mono text-slate-400 overflow-x-auto custom-scrollbar whitespace-pre-wrap max-h-40 p-2">
          {generateCSV().slice(0, 500)}...
        </pre>
      </div>
    </section>
  );
};
