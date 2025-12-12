import { GoogleGenAI } from "@google/genai";
import { NewsResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchNews = async (
  categoryKeywords: string,
  sources: string,
  userQuery?: string
): Promise<NewsResponse> => {
  // Use Thinking model for complex user queries (search), otherwise standard Flash
  const isComplex = !!userQuery;
  const model = isComplex ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';
  
  let prompt = `
    Atue como um jornalista sênior especializado no mercado de seguros e saúde suplementar.
    Sua tarefa é buscar e compilar as últimas notícias (prioridade para as últimas 24-48 horas) sobre o seguinte tema:
    
    TEMA/CATEGORIA: ${categoryKeywords}
    FONTES PRIORITÁRIAS: ${sources}
    ${userQuery ? `BUSCA ESPECÍFICA DO USUÁRIO: ${userQuery}` : ''}

    Instruções de Formatação:
    1. Crie uma lista com as 5 a 7 notícias mais relevantes e recentes encontradas.
    2. Para cada notícia, use o seguinte formato Markdown estrito:
       ### [Título da Manchete]
       **Fonte:** [Nome da Fonte] | **Data:** [Data ou "Hoje"]
       
       [Um resumo conciso de 2-3 parágrafos explicando o impacto para o setor, números relevantes e os players envolvidos.]

    3. Se houver vídeos do YouTube, jornais ou revistas relevantes na busca, mencione-os explicitamente.
    4. Mantenha um tom profissional, analítico e imparcial.
    5. Se não houver notícias "urgentes" nas últimas 24h, busque as mais relevantes da semana.
  `;

  const config: any = {
    tools: [{ googleSearch: {} }],
  };

  if (isComplex) {
    config.thinkingConfig = { thinkingBudget: 32768 };
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config,
    });

    const text = response.text || "Não foi possível carregar as notícias no momento.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      markdown: text,
      groundingChunks: groundingChunks as any[],
    };
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};

export const fetchNetworkLocations = async (locationQuery: string): Promise<NewsResponse> => {
  const model = 'gemini-2.5-flash';
  
  // Prompt enhanced to ask for specific fields: Address, Phone, Specialties
  const prompt = `
    Liste os principais hospitais, laboratórios e redes de prestadores baseados na busca: "${locationQuery}".
    
    Para cada local encontrado, forneça um relatório detalhado contendo os seguintes campos:
    - **Nome do Prestador**
    - **Endereço Completo** (Rua, Número, Bairro, Cidade - com CEP se disponível)
    - **Telefone de Contato** (Oficial)
    - **Horário de Funcionamento** (se disponível)
    - **Principais Especialidades/Serviços**
    
    Use formatação Markdown clara para listar esses campos (ex: listas com bullets).
    Se algum dado não estiver disponível, indique como "Não informado".
    
    No final, mantenha a seção separada com o título "### Fontes de Dados" listando as fontes oficiais.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        // We use both Maps (for location data) and Search (to find phone numbers/hours if Maps misses it)
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
      },
    });

    const text = response.text || "Nenhum local encontrado.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      markdown: text,
      groundingChunks: groundingChunks as any[],
    };
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
};

export const generateMarketTicker = async (): Promise<string[]> => {
    // Low latency model for quick updates
    const model = 'gemini-flash-lite-latest';
    const prompt = "Gere 5 manchetes curtíssimas (estilo ticker de bolsa) sobre o mercado de saúde e seguros no Brasil hoje. Apenas texto puro separado por pipe '|'.";
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });
        const text = response.text || "";
        return text.split('|').map(s => s.trim()).filter(s => s.length > 0);
    } catch (e) {
        return ["Mercado de Seguros em alta", "ANS divulga novos dados", "Setor de saúde suplementar cresce", "Tecnologia impulsiona seguradoras", "Novas regras para planos de saúde"];
    }
}
