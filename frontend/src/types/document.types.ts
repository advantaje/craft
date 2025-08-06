export interface SectionData {
  notes: string;
  outline: string;
  draft: string;
  reviewNotes: string;
}

export interface DocumentSection {
  id: string;
  name: string;
  data: SectionData;
  isCompleted: boolean;
}

export interface DocumentInfo {
  [key: string]: string;
}

export interface HelloResponse {
  message: string;
  timestamp: string;
}

export interface DocumentLookupRequest {
  id: string;
}

export interface DocumentLookupResponse {
  data: DocumentInfo;
}

export interface GenerateOutlineRequest {
  notes: string;
}

export interface GenerateOutlineResponse {
  outline: string;
}

export interface GenerateDraftFromOutlineRequest {
  notes: string;
  outline: string;
}

export interface GenerateDraftFromOutlineResponse {
  draft: string;
}

export interface GenerateReviewRequest {
  draft: string;
}

export interface GenerateReviewResponse {
  review: string;
}

export interface GenerateDraftFromReviewRequest {
  draft: string;
  reviewNotes: string;
}

export interface GenerateDraftFromReviewResponse {
  draft: string;
}

export interface ApiError {
  error: string;
}