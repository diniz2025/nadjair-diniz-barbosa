import React from 'react';
import { NewsCategory } from '../types';
import { 
  BuildingLibraryIcon, 
  HeartIcon, 
  BriefcaseIcon, 
  GlobeAmericasIcon, 
  CalculatorIcon,
  BeakerIcon,
  UserGroupIcon,
  MapIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  categories: NewsCategory[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'gov': return <BuildingLibraryIcon className="w-5 h-5" />;
      case 'health': return <HeartIcon className="w-5 h-5" />;
      case 'business': return <BriefcaseIcon className="w-5 h-5" />;
      case 'world': return <GlobeAmericasIcon className="w-5 h-5" />;
      case 'finance': return <CalculatorIcon className="w-5 h-5" />;
      case 'science': return <BeakerIcon className="w-5 h-5" />;
      case 'people': return <UserGroupIcon className="w-5 h-5" />;
      default: return <BriefcaseIcon className="w-5 h-5" />;
    }
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-slate-900 text-slate-300 fixed left-0 top-0 overflow-y-auto z-10">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="bg-blue-600 p-1 rounded">BR</span>
          Seguros<span className="text-blue-500">News</span>
        </h1>
        <p className="text-xs text-slate-500 mt-2">Inteligência de Mercado em Tempo Real</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {/* Special Map Button */}
        <button
            onClick={() => onSelectCategory('mapa_rede')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm font-medium mb-4 ${
              selectedCategory === 'mapa_rede'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
                : 'bg-slate-800 text-emerald-400 hover:bg-slate-700 hover:text-emerald-300'
            }`}
          >
            <MapIcon className="w-5 h-5" />
            Mapa da Rede
          </button>

        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Editorias</div>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm font-medium ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {getIcon(category.icon)}
            {category.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-white text-sm font-bold mb-2">Sobre as Fontes</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Monitoramos ANS, MS, Susep, Abramge, Fenacor, Rede D'Or, e centenas de outras fontes oficiais em tempo real via IA.
          </p>
        </div>
      </div>
    </aside>
  );
};
