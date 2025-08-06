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
}

export const apiService = new ApiService();