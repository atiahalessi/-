
import React from 'react';
import { StudyMatrix } from '../types';

interface StudyTableProps {
  studies: StudyMatrix[];
  onRemove: (id: string) => void;
  isReadOnly?: boolean;
}

export const StudyTable: React.FC<StudyTableProps> = ({ studies, onRemove, isReadOnly }) => {
  const headers = [
    "اسم الدراسة", "مكان النشر", "التاريخ", "المشكلة", "الأهداف", 
    "الأسئلة", "الحدود الزمانية", "المنهج", "الأداة", "الحدود المكانية", 
    "النتائج", "التوصيات", "المقترحات"
  ];

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-sm text-right border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="p-4 text-slate-500 font-bold whitespace-nowrap sticky right-0 bg-slate-50 z-10">#</th>
            {headers.map((h, i) => (
              <th key={i} className="p-4 text-slate-500 font-bold whitespace-nowrap min-w-[150px]">{h}</th>
            ))}
            {!isReadOnly && <th className="p-4 text-slate-500 font-bold whitespace-nowrap">إجراءات</th>}
          </tr>
        </thead>
        <tbody>
          {studies.map((study, index) => (
            <tr key={study.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
              <td className="p-4 font-bold text-slate-400 sticky right-0 bg-white/90 backdrop-blur-sm z-10 border-l border-slate-50">
                {index + 1}
              </td>
              <td className="p-4 font-bold text-slate-800 align-top min-w-[250px]">{study.title}</td>
              <td className="p-4 text-slate-600 align-top">{study.publicationVenue}</td>
              <td className="p-4 text-slate-600 align-top font-mono">{study.publicationYear}</td>
              <td className="p-4 text-slate-600 align-top max-w-xs leading-relaxed">{study.researchProblem}</td>
              <td className="p-4 text-slate-600 align-top max-w-xs leading-relaxed">{study.objectives}</td>
              <td className="p-4 text-slate-600 align-top max-w-xs leading-relaxed">{study.questions}</td>
              <td className="p-4 text-slate-600 align-top">{study.temporalLimits}</td>
              <td className="p-4 text-slate-600 align-top">{study.methodology}</td>
              <td className="p-4 text-slate-600 align-top">{study.tools}</td>
              <td className="p-4 text-slate-600 align-top">{study.spatialLimits}</td>
              <td className="p-4 text-slate-600 align-top max-w-xs leading-relaxed font-medium text-indigo-900 bg-indigo-50/30">{study.keyResults}</td>
              <td className="p-4 text-slate-600 align-top max-w-xs leading-relaxed">{study.recommendations}</td>
              <td className="p-4 text-slate-600 align-top max-w-xs leading-relaxed italic">{study.suggestions}</td>
              {!isReadOnly && (
                <td className="p-4 align-top">
                  <button 
                    onClick={() => onRemove(study.id)}
                    className="w-8 h-8 rounded-full hover:bg-red-50 text-red-400 hover:text-red-600 transition-all flex items-center justify-center"
                    title="حذف من الجدول"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
