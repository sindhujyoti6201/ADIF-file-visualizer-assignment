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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://0u1zc3y2jb.execute-api.us-east-1.amazonaws.com/prod';

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