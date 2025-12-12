import React from 'react';

interface TickerProps {
  headlines: string[];
}

export const Ticker: React.FC<TickerProps> = ({ headlines }) => {
  if (headlines.length === 0) return null;

  return (
    <div className="bg-blue-900 text-white text-sm py-2 overflow-hidden whitespace-nowrap relative flex items-center">
      <span className="bg-blue-700 px-4 py-2 absolute left-0 z-10 font-bold text-xs uppercase tracking-wider shadow-lg">
        Últimas do Mercado
      </span>
      <div className="animate-marquee inline-block pl-32">
        {headlines.map((headline, index) => (
          <span key={index} className="mx-8 font-medium text-blue-100">
            • {headline}
          </span>
        ))}
      </div>
      <style>{`
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};
