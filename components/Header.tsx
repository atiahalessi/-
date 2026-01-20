
import React from 'react';

interface HeaderProps {
  isReadOnly?: boolean;
  onExitReadOnly?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isReadOnly, onExitReadOnly }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <i className="fa-solid fa-microscope text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-none">مُحلل الدراسات الأكاديمية</h1>
            <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">
              {isReadOnly ? 'عرض فقط' : 'Scientific Matrix Builder v1.0'}
            </span>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-6">
          {isReadOnly ? (
            <button 
              onClick={onExitReadOnly}
              className="flex items-center gap-2 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold transition-all"
            >
              <i className="fa-solid fa-plus"></i>
              <span>إنشاء مصفوفة جديدة</span>
            </button>
          ) : (
            <>
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <i className="fa-solid fa-shield-halved text-green-500"></i>
                <span>معالجة آمنة للبيانات</span>
              </div>
              <div className="h-4 w-px bg-slate-200"></div>
              <a href="https://ai.google.dev" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-600 text-sm hover:text-indigo-600 transition-colors">
                <i className="fa-solid fa-bolt text-amber-500"></i>
                <span>مدعوم بـ Gemini 3</span>
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
