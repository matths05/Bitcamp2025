import { articleDataAssets } from './assetMap';

export interface ArticleData {
  title: string;
  banner_image?: string;
  url?: string;
  time_published: string;
  content?: string;
}

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  articles: ArticleData[];
}

export const getArticleData = (symbol: string, articleIndex: number): ArticleData => {
  const articleData = articleDataAssets[symbol as keyof typeof articleDataAssets]?.[articleIndex as 1 | 2 | 3];
  
  if (!articleData) {
    return {
      title: `Article not found for ${symbol}`,
      time_published: new Date().toISOString(),
      content: 'No content available'
    };
  }
  
  return {
    ...articleData,
    content: `This is the content for ${symbol} article ${articleIndex}. The actual content should be loaded from the API or stored locally.`
  };
};

export const formatDate = (dateString: string): string => {
  // Format: "20250412T172037" -> "April 12, 2025"
  if (!dateString || dateString.length < 8) return 'Unknown date';
  
  try {
    const year = dateString.substring(0, 4);
    const month = parseInt(dateString.substring(4, 6));
    const day = parseInt(dateString.substring(6, 8));
    
    const date = new Date(parseInt(year), month - 1, day);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Unknown date';
  }
}; 