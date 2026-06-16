/**
 * Type declarations for Student Academic Decline Prediction System.
 */

export interface StudentInput {
  name: string;
  age: number;
  gender: string;
  grade: number;
  study_hours: number;
  sleep_hours: number;
  absences: number;
  homework: string;
  gpa: number;
  mobile_hours: number;
  internet_hours: number;
  parental_support: string;
  motivation: string;
  participation: string;
}

export interface XAIFactor {
  factor: string;
  impact: string;
  severity: "High" | "Medium" | "Low";
}

export interface PredictionResponse {
  id: number;
  risk_level: string;
  risk_probability: number;
  confidence_score: number;
  factors: XAIFactor[];
  recommendations: string[];
  data: StudentInput;
}

export interface DashboardStats {
  empty: boolean;
  total_count: number;
  avg_gpa: number;
  avg_study: number;
  high_risk_count: number;
  riskDistribution: { name: string; value: number }[];
  gradeRiskDistribution: { grade: string; low: number; medium: number; high: number }[];
  scatterPoints: { studyHours: number; gpa: number; risk: string; name: string }[];
}

export interface HistoryRecord {
  id: number;
  name: string;
  age: number;
  gender: string;
  grade: number;
  study_hours: number;
  sleep_hours: number;
  absences: number;
  homework: string;
  gpa: number;
  mobile_hours: number;
  internet_hours: number;
  parental_support: string;
  motivation: string;
  participation: string;
  risk_level: string;
  risk_probability: number;
  confidence_score: number;
  timestamp: string;
}

export interface EvaluationResults {
  bestModelName: string;
  modelComparison: { name: string; accuracy: number; f1: number }[];
  featureImportance: { name: string; value: number }[];
}
