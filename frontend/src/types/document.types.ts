export interface TextSelection {
  text: string;
  start: number;
  end: number;
}

export interface SectionData {
  notes: string;
  draft: string;
  reviewNotes: string;
  selection?: TextSelection;
  selectedRows?: number[];
}

export interface DocumentSection {
  id: string;
  name: string;
  type: string;
  templateTag?: string;
  guidelines?: {
    draft: string;
    review: string;
    revision: string;
  };
  data: SectionData;
  isCompleted: boolean;
  completionType?: 'normal' | 'empty';
  wasCompleted?: boolean;
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

export interface DocumentFieldData {
  value: string;
  internal_field: string;
}

export interface DocumentInfo {
  [key: string]: DocumentFieldData;
}

export interface TemplateInfo {
  name: string;
  type: 'default' | 'custom';
  isUploaded?: boolean;
}

export interface HelloResponse {
  message: string;
  timestamp: string;
}

export interface ReviewLookupRequest {
  id: string;
}

export interface GenerateReviewRequest {
  draft: string;
  sectionName: string;
  sectionType: string;
  guidelines?: string;
  draftGuidelines?: string;
  modelId?: string;
}

export interface GenerateDraftFromReviewRequest {
  draft: string;
  reviewNotes: string;
  sectionName: string;
  sectionType: string;
  guidelines?: string;
  draftGuidelines?: string;
  modelId?: string;
}

export interface GenerateDraftFromNotesRequest {
  notes: string;
  sectionName: string;
  sectionType: string;
  guidelines?: string;
  modelId?: string;
}

export interface ApiError {
  error: string;
}

export interface GenerateDocumentRequest {
  documentId: string;
  documentData: DocumentInfo | null;
  sections: DocumentSection[];
  templateInfo?: TemplateInfo;
}

export interface GenerateDocumentResponse {
  downloadUrl?: string;
  filename?: string;
}

export interface DiffSegment {
  type: 'unchanged' | 'added' | 'removed';
  text: string;
  original: string;
  revised: string;
}

export interface DiffSummary {
  words_added: number;
  words_removed: number;
  words_unchanged: number;
}

export interface GenerateDraftFromReviewWithDiffResponse {
  new_draft: string;
  original_formatted?: string;
  new_formatted?: string;
  diff_segments: DiffSegment[];
  diff_summary: DiffSummary;
}

export interface GenerateRowReviewRequest {
  rowData: { [key: string]: string | number };
  rowIndex: number;
  reviewNotes: string;
  columns: TableColumn[];
  sectionName: string;
  sectionType?: string;
  guidelines?: string;
  draftGuidelines?: string;
  fullTableData?: TableData;
  modelId?: string;
}

export interface GenerateRowReviewResponse {
  new_rows: Array<{ [key: string]: string | number }>; // Now an array of rows
  original_formatted: string;
  new_formatted: string;
  diff_segments: DiffSegment[];
  diff_summary: DiffSummary;
}

// Text selection types
export interface GenerateSelectionReviewRequest {
  selectedText: string;
  contextBefore: string;
  contextAfter: string;
  sectionName: string;
  sectionType?: string;
  guidelines?: string;
  draftGuidelines?: string;
  fullDraft?: string;
  modelId?: string;
}

export interface ApplySelectionReviewRequest {
  fullDraft: string;
  selectedText: string;
  selectionStart: number;
  selectionEnd: number;
  reviewNotes: string;
  sectionName: string;
  sectionType?: string;
  guidelines?: string;
  draftGuidelines?: string;
  modelId?: string;
}

export interface ApplySelectionReviewResponse {
  new_draft: string;
  original_selection: string;
  new_selection: string;
  diff_segments: DiffSegment[];
  diff_summary: DiffSummary;
}