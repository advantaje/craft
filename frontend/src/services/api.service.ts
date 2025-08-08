import axios, { AxiosInstance } from 'axios';
import {
  HelloResponse,
  DocumentInfo,
  DocumentLookupRequest,
  GenerateOutlineRequest,
  GenerateDraftFromOutlineRequest,
  GenerateReviewRequest,
  GenerateDraftFromReviewRequest,
  GenerateDocumentRequest,
  GenerateDocumentResponse,
} from '../types/document.types';

const API_BASE_URL = 'http://localhost:8888/api';

// Create axios instance
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Standardized response wrapper interface
interface ApiResponse<T> {
  result: T;
}

export async function getHello(): Promise<HelloResponse> {
  const response = await axiosInstance.get<ApiResponse<HelloResponse>>('/hello');
  return response.data.result;
}

export async function lookupDocument(request: DocumentLookupRequest): Promise<DocumentInfo> {
  const response = await axiosInstance.post<ApiResponse<DocumentInfo>>('/document-lookup', request);
  return response.data.result;
}

export async function generateOutline(request: GenerateOutlineRequest): Promise<string> {
  const response = await axiosInstance.post<ApiResponse<string>>('/generate-outline', request);
  return response.data.result;
}

export async function generateDraftFromOutline(request: GenerateDraftFromOutlineRequest): Promise<string> {
  const response = await axiosInstance.post<ApiResponse<string>>('/generate-draft-from-outline', request);
  return response.data.result;
}

export async function generateReview(request: GenerateReviewRequest): Promise<string> {
  const response = await axiosInstance.post<ApiResponse<string>>('/generate-review', request);
  return response.data.result;
}

export async function generateDraftFromReview(request: GenerateDraftFromReviewRequest): Promise<string> {
  const response = await axiosInstance.post<ApiResponse<string>>('/generate-draft-from-review', request);
  return response.data.result;
}

export async function generateDocument(request: GenerateDocumentRequest): Promise<GenerateDocumentResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-document`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to generate document');
    }

    // For file download, we need to handle the response as a blob
    const blob = await response.blob();
    
    // Create a download URL for the blob
    const downloadUrl = window.URL.createObjectURL(blob);
    
    return { downloadUrl };
  } catch (error) {
    console.error(`API Error: ${API_BASE_URL}/generate-document`, error);
    throw error;
  }
}