import {
  HelloResponse,
  DocumentLookupRequest,
  DocumentLookupResponse,
  GenerateOutlineRequest,
  GenerateOutlineResponse,
  GenerateDraftFromOutlineRequest,
  GenerateDraftFromOutlineResponse,
  GenerateReviewRequest,
  GenerateReviewResponse,
  GenerateDraftFromReviewRequest,
  GenerateDraftFromReviewResponse,
  GenerateDocumentRequest,
  GenerateDocumentResponse,
  ApiError
} from '../types/document.types';

const API_BASE_URL = 'http://localhost:8888/api';

class ApiService {
  private async fetchWithErrorHandling<T>(
    url: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiError).error || 'An error occurred');
      }

      return data as T;
    } catch (error) {
      console.error(`API Error: ${url}`, error);
      throw error;
    }
  }

  async getHello(): Promise<HelloResponse> {
    return this.fetchWithErrorHandling<HelloResponse>(`${API_BASE_URL}/hello`);
  }

  async lookupDocument(request: DocumentLookupRequest): Promise<DocumentLookupResponse> {
    return this.fetchWithErrorHandling<DocumentLookupResponse>(
      `${API_BASE_URL}/document-lookup`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  async generateOutline(request: GenerateOutlineRequest): Promise<GenerateOutlineResponse> {
    return this.fetchWithErrorHandling<GenerateOutlineResponse>(
      `${API_BASE_URL}/generate-outline`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  async generateDraftFromOutline(
    request: GenerateDraftFromOutlineRequest
  ): Promise<GenerateDraftFromOutlineResponse> {
    return this.fetchWithErrorHandling<GenerateDraftFromOutlineResponse>(
      `${API_BASE_URL}/generate-draft-from-outline`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  async generateReview(request: GenerateReviewRequest): Promise<GenerateReviewResponse> {
    return this.fetchWithErrorHandling<GenerateReviewResponse>(
      `${API_BASE_URL}/generate-review`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  async generateDraftFromReview(
    request: GenerateDraftFromReviewRequest
  ): Promise<GenerateDraftFromReviewResponse> {
    return this.fetchWithErrorHandling<GenerateDraftFromReviewResponse>(
      `${API_BASE_URL}/generate-draft-from-review`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  async generateDocument(request: GenerateDocumentRequest): Promise<GenerateDocumentResponse> {
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
}

export const apiService = new ApiService();