import React from 'react';
import { GroundingChunk } from '../types';

interface SourcesListProps {
  chunks: GroundingChunk[];
}

export const SourcesList: React.FC<SourcesListProps> = ({ chunks }) => {
  if (!chunks || chunks.length === 0) return null;

  // Use a Map to deduplicate by URI.
  // Explicitly typing the Map helps TypeScript infer the correct types for the values.
  const uniqueLinksMap = new Map<string, GroundingChunk>();

  chunks.forEach((chunk) => {
    // Cast to ensure we are working with the expected type, 
    // in case strict mode infers 'unknown' from the array source.
    const c = chunk as GroundingChunk;
    const uri = c.web?.uri;
    const title = c.web?.title;

    if (uri && title) {
      uniqueLinksMap.set(uri, c);
    }
  });

  const uniqueLinks = Array.from(uniqueLinksMap.values());

  if (uniqueLinks.length === 0) return null;

  return (
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mt-6">
      <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        Fontes Citadas & Links Relevantes
      </h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {uniqueLinks.map((chunk, idx) => (
          <li key={idx}>
            <a 
              href={chunk.web?.uri} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-start gap-2 truncate"
              title={chunk.web?.title}
            >
              <span className="text-slate-400 mt-0.5">•</span>
              <span className="truncate">{chunk.web?.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};