import axios, { AxiosInstance } from 'axios';
import {
  HelloResponse,
  DocumentInfo,
  ReviewLookupRequest,
  GenerateOutlineRequest,
  GenerateDraftFromOutlineRequest,
  GenerateReviewRequest,
  GenerateDraftFromReviewRequest,
  GenerateDocumentRequest,
  GenerateDocumentResponse,
} from '../types/document.types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8888/api';

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

export async function lookupReview(request: ReviewLookupRequest): Promise<DocumentInfo> {
  const response = await axiosInstance.post<ApiResponse<DocumentInfo>>('/review-lookup', request);
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
    const response = await axiosInstance.post<Blob>('/generate-document', request, {
      responseType: 'blob'
    });

    // Create a download URL for the blob
    const downloadUrl = window.URL.createObjectURL(response.data);
    
    return { downloadUrl };
  } catch (error) {
    console.error(`API Error: ${API_BASE_URL}/generate-document`, error);
    throw error;
  }
}


export async function uploadTemplate(file: File): Promise<{templateKey: string, filename: string}> {
  try {
    const formData = new FormData();
    formData.append('template', file);

    const response = await axiosInstance.post<ApiResponse<{templateKey: string, filename: string}>>('/upload-template', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.result;
  } catch (error) {
    console.error(`API Error: ${API_BASE_URL}/upload-template`, error);
    throw error;
  }
}