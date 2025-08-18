import axios, { AxiosInstance } from 'axios';
import {
  HelloResponse,
  DocumentInfo,
  ReviewLookupRequest,
  GenerateReviewRequest,
  GenerateDraftFromReviewRequest,
  GenerateDraftFromNotesRequest,
  GenerateDocumentRequest,
  GenerateDocumentResponse,
  GenerateDraftFromReviewWithDiffResponse,
  GenerateRowReviewRequest,
  GenerateRowReviewResponse,
} from '../types/document.types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8888';

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
  const response = await axiosInstance.get<ApiResponse<HelloResponse>>('/api/hello');
  return response.data.result;
}

export async function lookupReview(request: ReviewLookupRequest): Promise<DocumentInfo> {
  const response = await axiosInstance.get<ApiResponse<DocumentInfo>>(`/api/review-lookup?id=${encodeURIComponent(request.id)}`);
  return response.data.result;
}

export async function generateReview(request: GenerateReviewRequest): Promise<string> {
  const response = await axiosInstance.post<ApiResponse<string>>('/api/generate-review', request);
  return response.data.result;
}


export async function generateDraftFromNotes(request: GenerateDraftFromNotesRequest): Promise<string> {
  const response = await axiosInstance.post<ApiResponse<string>>('/api/generate-draft-from-notes', request);
  return response.data.result;
}

export async function generateDraftFromReviewWithDiff(request: GenerateDraftFromReviewRequest): Promise<GenerateDraftFromReviewWithDiffResponse> {
  const response = await axiosInstance.post<ApiResponse<GenerateDraftFromReviewWithDiffResponse>>('/api/generate-draft-from-review-with-diff', request);
  return response.data.result;
}

export async function generateRowFromReviewWithDiff(request: GenerateRowReviewRequest): Promise<GenerateRowReviewResponse> {
  const response = await axiosInstance.post<ApiResponse<GenerateRowReviewResponse>>('/api/generate-row-from-review-with-diff', request);
  return response.data.result;
}

export async function generateTableFromReviewWithDiff(request: GenerateDraftFromReviewRequest): Promise<GenerateDraftFromReviewWithDiffResponse> {
  const response = await axiosInstance.post<ApiResponse<GenerateDraftFromReviewWithDiffResponse>>('/api/generate-table-from-review-with-diff', request);
  return response.data.result;
}

export async function generateDocument(request: GenerateDocumentRequest): Promise<GenerateDocumentResponse> {
  try {
    const response = await axiosInstance.post<Blob>('/api/generate-document', request, {
      responseType: 'blob'
    });

    // Create a download URL for the blob
    const downloadUrl = window.URL.createObjectURL(response.data);
    
    return { downloadUrl };
  } catch (error) {
    console.error(`API Error: /api/generate-document`, error);
    throw error;
  }
}


export async function uploadTemplate(file: File): Promise<{templateKey: string, filename: string}> {
  try {
    const formData = new FormData();
    formData.append('template', file);

    const response = await axiosInstance.post<ApiResponse<{templateKey: string, filename: string}>>('/api/upload-template', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.result;
  } catch (error) {
    console.error(`API Error: /api/upload-template`, error);
    throw error;
  }
}