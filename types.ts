
export interface StudyMatrix {
  id: string;
  fileName: string;
  title: string;
  publicationVenue: string;
  publicationYear: string;
  researchProblem: string;
  objectives: string;
  questions: string;
  temporalLimits: string;
  methodology: string;
  tools: string;
  spatialLimits: string;
  keyResults: string;
  recommendations: string;
  suggestions: string;
}

export interface AnalysisStatus {
  fileId: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
  error?: string;
}
