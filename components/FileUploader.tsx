
import React from 'react';
import { AnalysisStatus } from '../types';

interface FileUploaderProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isProcessing: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  statuses: AnalysisStatus[];
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileChange, isProcessing, inputRef, statuses }) => {
  // Only show the most relevant statuses (processing or latest results)
  const displayStatuses = statuses.slice(-12).reverse();

  return (
    <div className="space-y-6">
      <div 
        onClick={() => !isProcessing && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer relative group
          ${isProcessing ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-80' : 'bg-indigo-50/20 border-indigo-100 hover:border-indigo-400 hover:bg-indigo-50/50'}
        `}
      >
        <input 
          type="file" 
          multiple 
          accept=".pdf" 
          className="hidden" 
          onChange={onFileChange} 
          ref={inputRef}
          disabled={isProcessing}
        />
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${isProcessing ? 'bg-slate-200 text-slate-400' : 'bg-indigo-100 text-indigo-600 shadow-inner'}`}>
          {isProcessing ? (
            <i className="fa-solid fa-sync fa-spin text-2xl"></i>
          ) : (
            <i className="fa-solid fa-plus text-2xl"></i>
          )}
        </div>
        <p className="text-slate-700 font-bold text-lg text-center">
          {isProcessing ? 'جاري معالجة الملفات في وقت واحد...' : 'اختر ملفات PDF للتحليل'}
        </p>
        <p className="text-slate-400 text-sm mt-2 font-medium tracking-wide uppercase">يمكنك تحديد عدة ملفات دفعة واحدة</p>
        
        {isProcessing && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-100 overflow-hidden rounded-b-xl">
            <div className="h-full bg-indigo-600 animate-[loading_2s_infinite_linear]" style={{width: '30%'}}></div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>

      {statuses.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">حالة التحليل الموازي</h3>
            {isProcessing && (
              <span className="flex items-center gap-2 text-[10px] text-indigo-600 font-bold">
                <i className="fa-solid fa-circle-nodes animate-pulse"></i>
                معالجة متزامنة نشطة
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayStatuses.map((status) => (
              <div key={status.fileId} className={`relative flex flex-col p-3 rounded-xl border transition-all duration-300 overflow-hidden ${
                status.status === 'completed' ? 'bg-green-50/50 border-green-100' : 
                status.status === 'error' ? 'bg-red-50/50 border-red-100' : 
                status.status === 'processing' ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 
                'bg-slate-50 border-slate-100'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 text-base flex-shrink-0 ${
                    status.status === 'completed' ? 'text-green-500' : 
                    status.status === 'error' ? 'text-red-500' : 
                    status.status === 'processing' ? 'text-indigo-600' : 
                    'text-slate-400'
                  }`}>
                    {status.status === 'completed' && <i className="fa-solid fa-check-circle"></i>}
                    {status.status === 'error' && <i className="fa-solid fa-circle-exclamation"></i>}
                    {status.status === 'processing' && <i className="fa-solid fa-gear fa-spin"></i>}
                    {status.status === 'pending' && <i className="fa-solid fa-hourglass-start"></i>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate leading-none mb-1">{status.fileName}</p>
                    <p className={`text-[10px] font-medium ${
                      status.status === 'completed' ? 'text-green-600' : 
                      status.status === 'error' ? 'text-red-600' : 
                      status.status === 'processing' ? 'text-indigo-700' : 'text-slate-500'
                    }`}>
                      {status.status === 'completed' ? 'جاهز للعرض' : 
                       status.status === 'error' ? (status.error || 'خطأ غير متوقع') : 
                       status.status === 'processing' ? `جاري الاستخراج... ${Math.round(status.progress || 0)}%` : 'في قائمة الانتظار'}
                    </p>
                  </div>
                </div>

                {/* Individual Progress Bar */}
                {(status.status === 'processing' || status.status === 'completed') && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
                    <div 
                      className={`h-full transition-all duration-500 ease-out ${
                        status.status === 'completed' ? 'bg-green-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${status.progress || 0}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
