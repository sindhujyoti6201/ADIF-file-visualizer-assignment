export interface Feature {
  id: string;
  name: string;
  confidence: number;
  vector: number[];
}

export interface UploadResponse {
  filename: string;
  processing_ms: number;
  features: Feature[];
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
  summary: {
    totalDoctors: number;
    averageExperience: number;
    averageRating: number;
    averageSuccessRate: number;
    totalPatients: number;
    departments: string[];
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

export async function getDoctors(): Promise<DoctorsResponse> {
  console.log("Fetching doctors data...");
  const response = await fetch(`${API_URL}/doctors`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch doctors data');
  }

  const data = await response.json();
  console.log('Doctors response:', data);
  return data;
} 