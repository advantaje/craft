export interface SectionData {
  notes: string;
  outline: string;
  draft: string;
  reviewNotes: string;
}

export interface DocumentSection {
  id: string;
  name: string;
  type: string;
  data: SectionData;
  isCompleted: boolean;
}

export interface TableColumn {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  width?: string;
  required?: boolean;
  options?: string[];
}

export interface TableData {
  rows: Array<{ [columnId: string]: string | number }>;
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
  sectionName: string;
  sectionType: string;
}

export interface GenerateOutlineResponse {
  outline: string;
}

export interface GenerateDraftFromOutlineRequest {
  notes: string;
  outline: string;
  sectionName: string;
  sectionType: string;
}

export interface GenerateDraftFromOutlineResponse {
  draft: string;
}

export interface GenerateReviewRequest {
  draft: string;
  sectionName: string;
  sectionType: string;
}

export interface GenerateReviewResponse {
  review: string;
}

export interface GenerateDraftFromReviewRequest {
  draft: string;
  reviewNotes: string;
  sectionName: string;
  sectionType: string;
}

export interface GenerateDraftFromReviewResponse {
  draft: string;
}

export interface ApiError {
  error: string;
}

export interface GenerateDocumentRequest {
  documentId: string;
  documentData: DocumentInfo | null;
  sections: DocumentSection[];
}

export interface GenerateDocumentResponse {
  downloadUrl?: string;
}

export interface DocumentGenerationProgressEvent {
  status: 'validating' | 'preparing' | 'header' | 'metadata' | 'processing' | 'finalizing' | 'complete' | 'ready' | 'error';
  message: string;
  progress: number;
  downloadData?: {
    content: string;
    filename: string;
    contentType: string;
  };
}