export interface ResearchPaper {
  id: string;
  title: string;
  author: string;
  abstract: string;
  CID: string;
  version: number;
  timestamp: string;
  parentCID?: string;
  fileSize?: number;
  fileType?: string;
  keywords?: string[];
  doi?: string;
  isVerified?: boolean;
}

export interface UploadMetadata {
  title: string;
  author: string;
  abstract: string;
  keywords?: string[];
  doi?: string;
}

export interface SearchFilters {
  query?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  verified?: boolean;
}

export interface PDPProof {
  paperId: string;
  CID: string;
  proof: string;
  timestamp: string;
  isValid: boolean;
}

export interface WalletConnection {
  address: string;
  isConnected: boolean;
  provider?: string;
}

export interface FileUpload {
  file: File;
  metadata: UploadMetadata;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
