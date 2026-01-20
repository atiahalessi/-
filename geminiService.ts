
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { StudyMatrix } from "./types";

// Fix: Initialize GoogleGenAI using the process.env.API_KEY directly as required
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const STUDY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'اسم الدراسة (العنوان كاملاً)' },
    publicationVenue: { type: Type.STRING, description: 'مكان النشر (المجلة أو المؤتمر أو الجامعة)' },
    publicationYear: { type: Type.STRING, description: 'تاريخ النشر (السنة)' },
    researchProblem: { type: Type.STRING, description: 'مشكلة الدراسة (بصياغة مركزة)' },
    objectives: { type: Type.STRING, description: 'أهداف الدراسة (نقاط واضحة)' },
    questions: { type: Type.STRING, description: 'أسئلة الدراسة' },
    temporalLimits: { type: Type.STRING, description: 'حدود الدراسة الزمانية' },
    methodology: { type: Type.STRING, description: 'منهج الدراسة (وصفي، تحليلي، تجريبي... إلخ)' },
    tools: { type: Type.STRING, description: 'أداة الدراسة (استبيان، مقابلة، ملاحظة... إلخ)' },
    spatialLimits: { type: Type.STRING, description: 'حدود الدراسة المكانية' },
    keyResults: { type: Type.STRING, description: 'أهم النتائج (النتائج الجوهرية فقط)' },
    recommendations: { type: Type.STRING, description: 'التوصيات' },
    suggestions: { type: Type.STRING, description: 'المقترحات (الدراسات المستقبلية المقترحة)' },
  },
  required: [
    'title', 'publicationVenue', 'publicationYear', 'researchProblem', 
    'objectives', 'questions', 'temporalLimits', 'methodology', 
    'tools', 'spatialLimits', 'keyResults', 'recommendations', 'suggestions'
  ],
};

export const analyzeStudyFile = async (fileBase64: string, fileName: string): Promise<Partial<StudyMatrix>> => {
  try {
    // Fix: Using correct contents structure and property access for .text
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: fileBase64,
            },
          },
          {
            text: `أنت خبير في البحث العلمي وتحليل الدراسات الأكاديمية. مهمتك هي تحليل الملف المرفق واستخراج البيانات بدقة متناهية لتكوين "مصفوفة الدراسات".
            إذا كانت الدراسة بالإنجليزية، قم بترجمة المحتوى إلى العربية بدقة.
            إذا كانت المعلومة غير متوفرة، اكتب "غير محدد في النص".
            
            استخرج المعلومات التالية بالضبط:
            1. اسم الدراسة
            2. مكان النشر
            3. تاريخ النشر
            4. مشكلة الدراسة
            5. أهداف الدراسة
            6. أسئلة الدراسة
            7. حدود الدراسة الزمانية
            8. منهج الدراسة
            9. أداة الدراسة
            10. حدود الدراسة المكانية
            11. أهم النتائج
            12. التوصيات
            13. المقترحات`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: STUDY_SCHEMA,
        // Fix: Changed thinkingBudget from 0 to 16384 as gemini-3-pro-preview requires thinking mode enabled
        thinkingConfig: { thinkingBudget: 16384 }
      },
    });

    // Fix: Access response.text directly (property, not method)
    const result = JSON.parse(response.text || '{}');
    return { ...result, fileName };
  } catch (error) {
    console.error("Error analyzing file:", error);
    throw error;
  }
};
