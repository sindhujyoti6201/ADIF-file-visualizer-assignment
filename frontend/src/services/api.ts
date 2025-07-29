export interface Feature {
  id: string;
  name: string;
  confidence: number;
  vector: number[];
}

export interface UploadResponse {
  status: string;
  message: string;
  filename: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  department: string;
  patientsCount: number;
  successRate: number;
  rating: number;
  availability: string;
  location: string;
  education: string;
  certifications: string[];
  languages: string[];
  contact: {
    email: string;
    phone: string;
  };
  stats: {
    surgeriesPerformed: number;
    patientsRecovered: number;
    researchPapers: number;
    awards: number;
  };
}

export interface DoctorsResponse {
  doctors: Doctor[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_records: number;
    has_next: boolean;
    has_prev: boolean;
    limit: number;
  };
  summary: {
    totalDoctors: number;
    averageExperience: number;
    averageRating: number;
    averageSuccessRate: number;
    totalPatients: number;
    departments: string[];
  };
}

export interface DoctorsAnalytics {
  specialization_distribution: Array<{specialization: string, count: number}>;
  department_distribution: Array<{department: string, count: number}>;
  rating_distribution: Array<{rating: string, count: number}>;
  experience_vs_success: Array<{
    experience: number;
    successRate: number;
    rating: number;
    name: string;
  }>;
}

export interface DoctorsSummary {
  totalDoctors: number;
  averageExperience: number;
  averageRating: number;
  averageSuccessRate: number;
  totalPatients: number;
  departments: string[];
  calculated_stats?: {
    average_experience: number;
    average_rating: number;
    average_success_rate: number;
    departments: string[];
    specializations: string[];
  };
}

export interface PatientInfo {
  patient: {
    name: string;
    age: number;
    gender: string;
    bloodType: string;
    height: string;
    weight: string;
    allergies: string[];
    currentMedications: string[];
    disorders: any[];
    recommendedDoctors: any[];
    recentTests: any[];
    riskFactors: string[];
  };
  analysis: {
    overallHealthScore: number;
    riskLevel: string;
    recommendations: string[];
    nextAppointment: string;
    emergencyContact: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  console.log("ERROR INSIDE UPLOAD FILE");
  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }
    
  console.log("----------------------------");

  const data = await response.json();
  console.log('Backend response:', data);
  return data;
}

export async function getDoctors(
  search?: string,
  department?: string,
  specialization?: string,
  page?: number,
  limit?: number
): Promise<DoctorsResponse> {
  console.log("Fetching doctors data...");
  
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (department) params.append('department', department);
  if (specialization) params.append('specialization', specialization);
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const url = `${API_URL}/doctors${params.toString() ? `?${params.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch doctors data');
  }

  const data = await response.json();
  console.log('Backend response:', data);
  return data;
}

export async function getDoctorsAnalytics(): Promise<DoctorsAnalytics> {
  console.log("Fetching doctors analytics...");
  const response = await fetch(`${API_URL}/doctors/analytics`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch doctors analytics');
  }

  const data = await response.json();
  console.log('Analytics response:', data);
  return data;
}

export async function getDoctorsSummary(): Promise<DoctorsSummary> {
  console.log("Fetching doctors summary...");
  const response = await fetch(`${API_URL}/doctors/summary`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch doctors summary');
  }

  const data = await response.json();
  console.log('Summary response:', data);
  return data;
}

export async function getPatientInfo(): Promise<PatientInfo> {
  console.log("Fetching patient info...");
  const response = await fetch(`${API_URL}/patient-info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch patient info');
  }

  const data = await response.json();
  console.log('Patient info response:', data);
  return data;
}

export interface BackendPatient {
  id: string;
  age: number;
  gender: string;
  diagnosis: string;
  lengthOfStay: number;
  readmission: boolean;
  vitalSigns: {
    heartRate: number;
    bloodPressure: number;
    temperature: number;
    oxygenSaturation: number;
  };
}

export interface PatientsResponse {
  filename: string;
  processing_ms: number;
  patients: BackendPatient[];
}

export async function getPatients(): Promise<PatientsResponse> {
  console.log("Fetching patients data...");
  const response = await fetch(`${API_URL}/patients`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch patients data');
  }

  const data = await response.json();
  console.log('Patients response:', data);
  return data;
} 