export interface NewsCategory {
  id: string;
  label: string;
  icon: string;
  keywords: string;
  sources: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  // Google Maps grounding chunk structure
  maps?: {
    placeId?: string;
    title: string;
    uri: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
        author: string;
      }[];
    };
  };
}

export interface NewsResponse {
  markdown: string;
  groundingChunks: GroundingChunk[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
