import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { NewsCard } from './components/NewsCard';
import { Ticker } from './components/Ticker';
import { SourcesList } from './components/SourcesList';
import { MapResults } from './components/MapResults';
import { fetchNews, fetchNetworkLocations, generateMarketTicker } from './services/geminiService';
import { NewsCategory, LoadingState, NewsResponse } from './types';
import { MagnifyingGlassIcon, ArrowPathIcon, MapPinIcon } from '@heroicons/react/24/outline';

const CATEGORIES: NewsCategory[] = [
  {
    id: 'destaques',
    label: 'Destaques Gerais',
    icon: 'business',
    keywords: 'Mercado de seguros, planos de saúde, saúde suplementar no Brasil, fusões e aquisições',
    sources: 'Valor Econômico, InfoMoney, CNSeg, Abramge, ANS'
  },
  {
    id: 'regulacao',
    label: 'Regulação & Governo',
    icon: 'gov',
    keywords: 'Novas regras ANS, leis saúde suplementar, Ministério da Saúde, Anvisa decisões, Rol da ANS',
    sources: 'ANS, Ministério da Saúde, Anvisa, Diário Oficial da União, Idec, Procon'
  },
  {
    id: 'operadoras',
    label: 'Operadoras & Seguradoras',
    icon: 'health',
    keywords: 'Resultados financeiros operadoras de saúde, Unimed, Bradesco Saúde, SulAmérica, Amil, Hapvida, NotreDame',
    sources: 'Relatórios de Investidores, Susep, ANS, Fenacor'
  },
  {
    id: 'administradoras',
    label: 'Administradoras & Corretoras',
    icon: 'people',
    keywords: 'Qualicorp, Allcare, mercado de administradoras de benefícios, grandes corretoras de seguros Aon Marsh Willis',
    sources: 'Fenacor, Sincor, CQCS, Revista Apólice'
  },
  {
    id: 'prestadores',
    label: 'Hospitais & Laboratórios',
    icon: 'science',
    keywords: 'Rede D\'Or, Hospital Albert Einstein, Sirio Libanes, Dasa, Fleury, setor hospitalar',
    sources: 'Anahp, Saúde Business, FBH'
  },
  {
    id: 'internacional',
    label: 'Mercado Global',
    icon: 'world',
    keywords: 'Health insurance global trends, UnitedHealth Group global, reinsurance market trends',
    sources: 'Reuters, Bloomberg Insurance, Swiss Re, Munich Re'
  }
];

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('destaques');
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [newsData, setNewsData] = useState<NewsResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tickerItems, setTickerItems] = useState<string[]>([]);
  
  // Is Map Mode Active?
  const isMapMode = selectedCategory === 'mapa_rede';

  const loadData = async (categoryId: string, query?: string) => {
    setLoadingState(LoadingState.LOADING);
    
    try {
      let data: NewsResponse;
      
      if (categoryId === 'mapa_rede') {
        // Default map query if none provided
        const mapQuery = query || "Principais hospitais de excelência e redes laboratoriais no Brasil";
        data = await fetchNetworkLocations(mapQuery);
      } else {
        const category = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
        data = await fetchNews(category.keywords, category.sources, query);
      }

      setNewsData(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setLoadingState(LoadingState.ERROR);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      loadData(selectedCategory, searchQuery);
    }
  };

  const handleRefresh = () => {
    loadData(selectedCategory, searchQuery);
  };

  // Initial load or Category Change
  useEffect(() => {
    // If switching to map, clear old news data immediately to avoid confusion
    setNewsData(null); 
    loadData(selectedCategory);
    
    // Only fetch ticker once on mount
    if (tickerItems.length === 0) {
        generateMarketTicker().then(setTickerItems);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-20">
        <h1 className="font-bold text-xl">SegurosBR News</h1>
        <button className="text-slate-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar 
        categories={CATEGORIES} 
        selectedCategory={selectedCategory} 
        onSelectCategory={(id) => {
            setSearchQuery(''); // Clear search on category change
            setSelectedCategory(id);
        }} 
      />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar with Search and Ticker */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <Ticker headlines={tickerItems} />
          
          <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-1/2 relative">
               <form onSubmit={handleSearch}>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder={isMapMode ? "Ex: Hospitais Rede D'Or no RJ, Laboratórios em SP..." : "Pesquisar por empresa, lei ou tema..."}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {isMapMode ? (
                        <MapPinIcon className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                    ) : (
                        <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                    )}
                </div>
              </form>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Live Feed</span>
                <button 
                  onClick={handleRefresh}
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors"
                  title="Atualizar"
                >
                  <ArrowPathIcon className={`w-5 h-5 ${loadingState === LoadingState.LOADING ? 'animate-spin' : ''}`} />
                </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                    {isMapMode && <MapPinIcon className="w-8 h-8 text-emerald-600" />}
                    {isMapMode 
                        ? (searchQuery ? `Locais encontrados: "${searchQuery}"` : "Mapa da Rede de Saúde") 
                        : (searchQuery ? `Resultados para "${searchQuery}"` : CATEGORIES.find(c => c.id === selectedCategory)?.label)
                    }
                </h2>
                <p className="text-slate-500 mt-1">
                    {isMapMode 
                        ? 'Busque por hospitais, clínicas e prestadores por região. Dados fornecidos por Google Maps.'
                        : searchQuery 
                            ? 'Buscando em todas as fontes monitoradas...' 
                            : `Cobertura em tempo real das principais fontes: ${CATEGORIES.find(c => c.id === selectedCategory)?.sources.split(',').slice(0,3).join(', ')} e mais.`
                    }
                </p>
            </div>

            {loadingState === LoadingState.LOADING ? (
                <div className="space-y-6 animate-pulse">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-slate-200">
                            <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                            <div className="h-3 bg-slate-200 rounded w-1/4 mb-6"></div>
                            <div className="space-y-2">
                                <div className="h-3 bg-slate-200 rounded w-full"></div>
                                <div className="h-3 bg-slate-200 rounded w-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : loadingState === LoadingState.ERROR ? (
                <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center">
                    <p className="font-bold">Ocorreu um erro ao carregar os dados.</p>
                    <p className="text-sm mt-2">Verifique sua conexão e tente novamente.</p>
                    <button 
                        onClick={handleRefresh}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                    >
                        Tentar Novamente
                    </button>
                </div>
            ) : (
                <div className="space-y-8">
                    {isMapMode ? (
                        <MapResults 
                            content={newsData?.markdown || ""} 
                            chunks={newsData?.groundingChunks || []} 
                        />
                    ) : (
                        <>
                            <NewsCard content={newsData?.markdown || "Nenhuma notícia encontrada para este período."} />
                            {newsData?.groundingChunks && newsData.groundingChunks.length > 0 && (
                                <SourcesList chunks={newsData.groundingChunks} />
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;
