export interface MCQ {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PracticeProblem {
  title: string;
  description: string;
  hint: string;
}

export interface RoastResponse {
  roast: string;
  whyThisHappens: string;
  realWorldProblems: string;
  stepByStepFix: string[];
  correctedCode: string;
  goldenRule: string;
  mcqs: MCQ[];
  practiceProblem: PracticeProblem;
}

export type Language = 'javascript' | 'python' | 'cpp' | 'java';

export interface LanguageOption {
  value: Language;
  label: string;
  icon: string;
}

export const LANGUAGES: LanguageOption[] = [
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'cpp', label: 'C++', icon: '⚡' },
  { value: 'java', label: 'Java', icon: '☕' },
];
