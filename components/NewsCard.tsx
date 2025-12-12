import React from 'react';
import ReactMarkdown from 'react-markdown';

interface NewsCardProps {
  content: string;
}

// Simple parser helper to split the monolithic markdown into rough cards if needed, 
// but for now we will render the markdown directly in a styled container 
// and let the formatting do the work. 
// Ideally, we'd ask for JSON, but with Search Grounding we stick to text.

export const NewsCard: React.FC<NewsCardProps> = ({ content }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-headings:font-bold prose-a:text-blue-600 prose-strong:text-slate-600">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};
