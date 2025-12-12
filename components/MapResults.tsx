import React from 'react';
import { GroundingChunk } from '../types';
import ReactMarkdown from 'react-markdown';
import { MapPinIcon, CircleStackIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';

interface MapResultsProps {
  content: string;
  chunks: GroundingChunk[];
}

export const MapResults: React.FC<MapResultsProps> = ({ content, chunks }) => {
  // Filter for Map chunks specifically
  const mapChunks = chunks.filter(c => c.maps?.title && c.maps?.uri);

  // Split content to extract sources if present
  const splitContent = content.split('### Fontes de Dados');
  const mainAnalysis = splitContent[0];
  const sourcesSection = splitContent.length > 1 ? splitContent[1] : null;

  const handleDownload = () => {
    // Mock download functionality
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "relatorio_rede_saude.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div>
            <h3 className="text-blue-900 font-bold text-sm">Relatório Detalhado</h3>
            <p className="text-blue-600 text-xs">Inclui endereços, telefones e especialidades.</p>
        </div>
        <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Exportar Dados
        </button>
      </div>

      {/* Map Cards Grid */}
      {mapChunks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mapChunks.map((chunk, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <MapPinIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                        {chunk.maps?.title}
                    </h3>
                </div>
                {/* Check for review snippets if available */}
                {chunk.maps?.placeAnswerSources?.reviewSnippets && chunk.maps.placeAnswerSources.reviewSnippets.length > 0 && (
                    <p className="text-sm text-slate-500 mt-2 italic">
                        "{chunk.maps.placeAnswerSources.reviewSnippets[0].content}"
                    </p>
                )}
              </div>
              
              <a 
                href={chunk.maps?.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors text-sm"
              >
                Ver no Google Maps
              </a>
            </div>
          ))}
        </div>
      )}

      {/* AI Analysis/Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Dados dos Prestadores</h3>
        <div className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-headings:font-bold prose-a:text-blue-600 prose-strong:text-slate-600 prose-li:marker:text-blue-500">
            <ReactMarkdown>{mainAnalysis}</ReactMarkdown>
        </div>
      </div>

      {/* Data Sources Section */}
      {sourcesSection && (
         <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
             <div className="flex items-center gap-2 mb-4 text-slate-700 border-b border-slate-100 pb-2">
                <CircleStackIcon className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Fontes de Dados Sugeridas</h3>
             </div>
             <div className="prose prose-sm prose-slate text-slate-600">
                <ReactMarkdown>{sourcesSection}</ReactMarkdown>
             </div>
         </div>
      )}
    </div>
  );
};
