
import React, { useState, useEffect, useRef } from 'react';
import { StudyMatrix, AnalysisStatus } from './types';
import { analyzeStudyFile } from './geminiService';
import { Header } from './components/Header';
import { FileUploader } from './components/FileUploader';
import { StudyTable } from './components/StudyTable';
import { ExportSection } from './components/ExportSection';

const App: React.FC = () => {
  const [studies, setStudies] = useState<StudyMatrix[]>([]);
  const [statuses, setStatuses] = useState<AnalysisStatus[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#share=')) {
        try {
          const encodedData = hash.replace('#share=', '');
          const decodedData = decodeURIComponent(escape(atob(encodedData)));
          const sharedStudies = JSON.parse(decodedData);
          if (Array.isArray(sharedStudies)) {
            setStudies(sharedStudies);
            setIsReadOnly(true);
          }
        } catch (e) {
          console.error("Failed to parse shared matrix data", e);
          setIsReadOnly(false);
        }
      } else {
        setIsReadOnly(false);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const filesArray: File[] = Array.from(files);
    
    const newStatuses: AnalysisStatus[] = filesArray.map((file, index) => ({
      fileId: `${Date.now()}-${index}-${file.name}`,
      fileName: file.name,
      status: 'pending',
      progress: 0
    }));

    setStatuses(prev => [...prev, ...newStatuses]);
    setIsProcessing(true);

    const processFile = async (file: File, status: AnalysisStatus): Promise<StudyMatrix | null> => {
      const statusId = status.fileId;
      
      // Mark as processing
      setStatuses(prev => prev.map(s => s.fileId === statusId ? { ...s, status: 'processing', progress: 10 } : s));

      // Simulate progress since we can't get real progress from the AI API
      const progressInterval = setInterval(() => {
        setStatuses(prev => prev.map(s => {
          if (s.fileId === statusId && s.status === 'processing' && (s.progress || 0) < 90) {
            return { ...s, progress: (s.progress || 0) + Math.random() * 15 };
          }
          return s;
        }));
      }, 800);

      try {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
        });
        reader.readAsDataURL(file);
        const base64 = await base64Promise;

        const result = await analyzeStudyFile(base64, file.name);
        
        const study: StudyMatrix = {
          id: statusId,
          fileName: file.name,
          title: result.title || 'غير محدد',
          publicationVenue: result.publicationVenue || 'غير محدد',
          publicationYear: result.publicationYear || 'غير محدد',
          researchProblem: result.researchProblem || 'غير محدد',
          objectives: result.objectives || 'غير محدد',
          questions: result.questions || 'غير محدد',
          temporalLimits: result.temporalLimits || 'غير محدد',
          methodology: result.methodology || 'غير محدد',
          tools: result.tools || 'غير محدد',
          spatialLimits: result.spatialLimits || 'غير محدد',
          keyResults: result.keyResults || 'غير محدد',
          recommendations: result.recommendations || 'غير محدد',
          suggestions: result.suggestions || 'غير محدد',
        };

        clearInterval(progressInterval);
        setStatuses(prev => prev.map(s => s.fileId === statusId ? { ...s, status: 'completed', progress: 100 } : s));
        return study;
      } catch (error) {
        clearInterval(progressInterval);
        console.error(`Failed to process ${file.name}:`, error);
        setStatuses(prev => prev.map(s => s.fileId === statusId ? { 
          ...s, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'فشل التحليل',
          progress: 0
        } : s));
        return null;
      }
    };

    const processingPromises = filesArray.map((file, index) => processFile(file, newStatuses[index]));
    const results = await Promise.all(processingPromises);
    const successfulStudies = results.filter((s): s is StudyMatrix => s !== null);
    
    if (successfulStudies.length > 0) {
      setStudies(prev => [...prev, ...successfulStudies]);
    }

    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeStudy = (id: string) => {
    if (isReadOnly) return;
    setStudies(prev => prev.filter(s => s.id !== id));
    setStatuses(prev => prev.filter(s => s.fileId !== id));
  };

  const clearAll = () => {
    if (isReadOnly) return;
    if (window.confirm('هل أنت متأكد من مسح جميع البيانات؟')) {
      setStudies([]);
      setStatuses([]);
    }
  };

  const exitReadOnly = () => {
    window.location.hash = '';
    setStudies([]);
    setStatuses([]);
    setIsReadOnly(false);
  };

  return (
    <div className="min-h-screen pb-12">
      <Header isReadOnly={isReadOnly} onExitReadOnly={exitReadOnly} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {!isReadOnly && (
          <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">تحميل الدراسات</h2>
                <p className="text-slate-500 text-sm">ارفع ملفات PDF (أبحاث، رسائل علمية، مقالات) لتحليلها بالتوازي</p>
              </div>
              {studies.length > 0 && (
                <button 
                  onClick={clearAll}
                  className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <i className="fa-solid fa-trash-can"></i>
                  مسح المصفوفة
                </button>
              )}
            </div>

            <FileUploader 
              onFileChange={handleFileUpload} 
              isProcessing={isProcessing} 
              inputRef={fileInputRef}
              statuses={statuses}
            />
          </section>
        )}

        {studies.length > 0 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <section className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">
                  {isReadOnly ? 'معاينة المصفوفة المشتركة' : 'مصفوفة الدراسات المستخرجة'}
                </h2>
                <div className="flex gap-2">
                  <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                    {studies.length} دراسات
                  </span>
                </div>
              </div>
              <StudyTable studies={studies} onRemove={removeStudy} isReadOnly={isReadOnly} />
            </section>

            <ExportSection studies={studies} isReadOnly={isReadOnly} />
          </div>
        )}

        {studies.length === 0 && !isProcessing && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <i className="fa-solid fa-file-contract text-3xl"></i>
            </div>
            <p className="text-lg font-medium">ابدأ برفع دراسة واحدة على الأقل لتكوين المصفوفة</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
