import { FlatList, View, Text, StyleSheet, Dimensions } from 'react-native';
import { StockChart } from '../components/StockChart';
import { NewsCard, NewsItem } from '../components/NewsCard';
import { useState, useRef } from 'react';

const ITEM_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

// Mock news data (replace with real data later)
const mockNews = {
  'AAPL': [
    {
      id: '1',
      title: "Consumer Tech News: US President Puts 90-Days Pause On Tariffs, Microsoft May Cut Jobs & More",
      date: 'April 12, 2025',
      source: 'Benzinga',
      content: "US President puts 90-days pause on tariffs, impacting the tech industry including Apple.",
      banner_image: "https://cdn.benzinga.com/files/images/story/2025/04/12/Us-Tariff-Rate-Rising---Trade-Policy---B.jpeg?width=1200&height=800&fit=crop"
    },
    {
      id: '2',
      title: "Trump Administration Grants Tariff Reprieve To Tech Industry; Apple And Nvidia Among Beneficiaries",
      date: 'April 12, 2025',
      source: 'Benzinga',
      content: "The Trump administration has granted a tariff reprieve to the tech industry, with Apple and Nvidia among the beneficiaries.",
      banner_image: "https://cdn.benzinga.com/files/images/story/2025/04/12/Rostov-on-don-----Russia---February-3-20.jpeg?width=1200&height=800&fit=crop"
    },
    {
      id: '3',
      title: "Bulls And Bears: Apple, Nike, US Steel - And The Markets Ride Out Ongoing Volatility",
      date: 'April 12, 2025',
      source: 'Benzinga',
      content: "Market analysis featuring Apple, Nike, and US Steel as markets continue to experience volatility.",
      banner_image: "https://cdn.benzinga.com/files/images/story/2025/04/12/bulls-and-bears-25ai.jpeg?width=1200&height=800&fit=crop"
    }
  ],
  'INTC': [
    {
      id: '1',
      title: "Consumer Tech News: US President Puts 90-Days Pause On Tariffs, Microsoft May Cut Jobs & More",
      date: 'April 12, 2025',
      source: 'Benzinga',
      content: "US President puts 90-days pause on tariffs, potentially impacting Intel among other tech companies.",
      banner_image: "https://cdn.benzinga.com/files/images/story/2025/04/12/Us-Tariff-Rate-Rising---Trade-Policy---B.jpeg?width=1200&height=800&fit=crop"
    },
    {
      id: '2',
      title: "1 Artificial Intelligence Stock I'm Buying Hand Over First While It's Down 30%",
      date: 'April 12, 2025',
      source: 'The Motley Fool',
      content: "Analysis of an AI stock that's currently down 30%, possibly referencing Intel as an investment opportunity.",
      banner_image: "https://media.ycharts.com/charts/0bbb2b8bf87897e7c94107bb8f4a6ccb.png"
    },
    {
      id: '3',
      title: "Trump Tariff Wars: China's New Rule To Exempt Nvidia, Qualcomm And Others From Levies, But These Chip Companies Will Be Hit With 125% Tariffs",
      date: 'April 12, 2025',
      source: 'Benzinga',
      content: "China has implemented new tariff rules that exempt certain chip companies like Nvidia and Qualcomm, while others may face 125% tariffs.",
      banner_image: "https://editorial-assets.benzinga.com/wp-content/uploads/2025/04/12020305/Screenshot-2025-04-12-at-11.32.55%E2%80%AFAM.png"
    }
  ],
  'NET': [
    {
      id: '1',
      title: "Top Technology Executives Recognized at the 2025 SeattleCIO ORBIE Awards",
      date: 'April 11, 2025',
      source: 'Benzinga',
      content: "Recognition of top technology executives at the 2025 SeattleCIO ORBIE Awards.",
      banner_image: "https://ml.globenewswire.com/Resource/Download/0872b53b-016f-4ad5-a139-2c7a7452cbbc/dsc02815.jpg"
    },
    {
      id: '2',
      title: "Deal Dispatch: Harley-Davidson To Wipe Out? Plus, Prada's Versace Purchase Garners A Fashionable Price",
      date: 'April 11, 2025',
      source: 'Benzinga',
      content: "Business deals update including potential Harley-Davidson developments and Prada's purchase of Versace.",
      banner_image: "https://cdn.benzinga.com/files/images/story/2025/04/11/benzinga-deal-dispatch2.jpeg?width=1200&height=800&fit=crop"
    },
    {
      id: '3',
      title: "StarkWare researchers propose smart contracts for Bitcoin with ColliderVM",
      date: 'April 11, 2025',
      source: 'CoinTelegraph',
      content: "StarkWare researchers have proposed a new method for implementing smart contracts for Bitcoin using ColliderVM technology.",
      banner_image: "https://s3.cointelegraph.com/uploads/2025-04/0196247f-93b2-7017-8abd-51b6897228d2"
    }
  ],
  'PLTR': [
    {
      id: '1',
      title: "Stock Market Crash: Is Palantir a Buy?",
      date: 'April 12, 2025',
      source: 'The Motley Fool',
      content: "Analysis of whether Palantir represents a good buying opportunity during a stock market downturn.",
      banner_image: "https://g.foolcdn.com/image/?url=https%3A%2F%2Fg.foolcdn.com%2Feditorial%2Fimages%2F814273%2Fgettyimages-1361008768.jpg&op=resize&w=700"
    },
    {
      id: '2',
      title: "Should You Forget Palantir and Buy This Artificial Intelligence (AI) Stock Instead?",
      date: 'April 12, 2025',
      source: 'The Motley Fool',
      content: "Comparison between Palantir and another AI stock, evaluating which might be a better investment opportunity.",
      banner_image: "https://g.foolcdn.com/editorial/images/814214/ai-written-on-circuit-board.jpg"
    },
    {
      id: '3',
      title: "Prediction: 2 AI Stocks Will Be Worth More Than Palantir Technologies by Early 2026",
      date: 'April 12, 2025',
      source: 'The Motley Fool',
      content: "Analysis predicting that two AI stocks will surpass Palantir Technologies in market value by early 2026.",
      banner_image: "https://g.foolcdn.com/editorial/images/814557/artificial-intelligence-7.jpg"
    }
  ],
  'APP': [
    {
      id: '1',
      title: "AppLovin Corporation Investors: May 5, 2025 Filing Deadline in Securities Class Action",
      date: 'April 11, 2025',
      source: 'Benzinga',
      content: "Notification about May 5, 2025 filing deadline in securities class action for AppLovin Corporation investors.",
      banner_image: "https://ml.globenewswire.com/media/405ec490-b904-4a5e-85a7-710cdebe280d/small/ktmc-logo-rgb-jpg.jpg"
    },
    {
      id: '2',
      title: "Tech Stocks Soared This Week, but Uncertainty Persists",
      date: 'April 11, 2025',
      source: 'The Motley Fool',
      content: "Analysis of tech stocks performance this week with mention of ongoing uncertainty in the market.",
      banner_image: "https://g.foolcdn.com/editorial/images/814521/gettyimages-1492180527.jpg"
    },
    {
      id: '3',
      title: "Tech stocks head for winning week with Nvidia tracking for 15% bounceback",
      date: 'April 11, 2025',
      source: 'CNBC',
      content: "Tech stocks are heading for a winning week with Nvidia tracking for a 15% recovery.",
      banner_image: "" // Kept placeholder as source is null
    }
  ],
  'TSLA': [
    {
      id: '1',
      title: "Consumer Tech News: US President Puts 90-Days Pause On Tariffs, Microsoft May Cut Jobs & More",
      date: 'April 12, 2025',
      source: 'Benzinga',
      content: "US President puts 90-days pause on tariffs, potentially affecting Tesla among other tech companies.",
      banner_image: "https://cdn.benzinga.com/files/images/story/2025/04/12/Us-Tariff-Rate-Rising---Trade-Policy---B.jpeg?width=1200&height=800&fit=crop"
    },
    {
      id: '2',
      title: "Warren Buffett's Wealth Grows Even Amid Tariff War and Global Market Turmoil",
      date: 'April 12, 2025',
      source: 'Benzinga',
      content: "Warren Buffett's wealth continues to grow despite ongoing tariff war and global market turmoil, with mentions of Tesla.",
      banner_image: "https://cdn.benzinga.com/files/images/story/2025/04/12/Once-Called-A-Big-Mistake--Warren-Buffet.jpeg?width=1200&height=800&fit=crop"
    },
    {
      id: '3',
      title: "Elon Musk's Cybertruck Is Controversial, But Kids Love It",
      date: 'April 12, 2025',
      source: 'Benzinga',
      content: "While Tesla's Cybertruck has been controversial among adults, it appears to be popular with children.",
      banner_image: "https://cdn.benzinga.com/files/images/story/2025/04/12/San-Jose--Ca--Usa---November-25--2023-Te.jpeg?width=1200&height=800&fit=crop"
    }
  ],
  'MSTR': [
    {
      id: '1',
      title: "Insider Trading: 3 CEOs Recently Buying Shares",
      date: 'April 11, 2025',
      source: 'Zacks',
      content: "Report on three CEOs who have recently purchased shares of their own companies.",
      banner_image: "https://staticx-tuner.zacks.com/images/articles/main/ea/57303.jpg"
    },
    {
      id: '2',
      title: "Q2 Bitcoin ETF Outlook: Is It a Safer Exposure?",
      date: 'April 11, 2025',
      source: 'Zacks',
      content: "Analysis of Bitcoin ETF outlook for Q2, discussing whether it offers safer exposure compared to direct cryptocurrency investments.",
      banner_image: "https://staticx-tuner.zacks.com/images/articles/main/63/5033.jpg"
    },
    {
      id: '3',
      title: "Crypto-focused Janover skyrockets after completing its first Solana purchase",
      date: 'April 10, 2025',
      source: 'CNBC',
      content: "Crypto-focused company Janover sees significant stock price increase after completing its first Solana purchase.",
      banner_image: "" // Kept placeholder as source is null
    }
  ],
  'DJT': [
    {
      id: '1',
      title: "TMTG Form S-3 Registration Statement Becomes Effective",
      date: 'April 11, 2025',
      source: 'GlobeNewswire',
      content: "Trump Media & Technology Group's Form S-3 Registration Statement has become effective.",
      banner_image: "" // Kept placeholder as source is empty string
    },
    {
      id: '2',
      title: "Trump Media Ventures Into Canada And Mexico Amid Global Tariff Tensions",
      date: 'April 10, 2025',
      source: 'Benzinga',
      content: "Trump Media is expanding operations into Canada and Mexico amid ongoing global tariff tensions.",
      banner_image: "https://cdn.benzinga.com/files/images/story/2025/04/10/Future-Plans.jpeg?width=1200&height=800&fit=crop"
    },
    {
      id: '3',
      title: "Trump Pauses Tariffs After Yields Surge: 'Bond Vigilantes Hit Another Homerun,' Experts Point To Bond Market Panic For Reversal",
      date: 'April 10, 2025',
      source: 'Benzinga',
      content: "President Trump has paused tariffs following a surge in yields, with experts attributing the decision to bond market pressure.",
      banner_image: "https://cdn.benzinga.com/files/images/story/2025/04/10/Bonds-Shutterstock.jpeg?width=1200&height=800&fit=crop"
    }
  ]
}

const updatedItems = [
  {
    id: '1',
    title: 'AAPL',
    description: 'Apple Inc.',
    data: [205.5, 194, 181.5, 186.7, 199, 190.5, 198]
  },
  {
    id: '2',
    title: 'INTC',
    description: 'Intel Corporation',
    data: [22.4, 21.7, 19.6, 20, 21.5, 20.7, 19.7]
  },
  {
    id: '3',
    title: 'NET',
    description: 'Cloudflare, Inc.',
    data: [112.5, 101.3, 98.5, 106.2, 112.5, 108.2, 106.3]
  },
  {
    id: '4',
    title: 'PLTR',
    description: 'Palantir Technologies Inc.',
    data: [83.6, 74, 77.8, 77.2, 92, 88.6, 88.5]
  },
  {
    id: '5',
    title: 'APP',
    description: 'AppLovin Corporation',
    data: [261.5, 219.2, 232.2, 235.5, 275.5, 263.6, 250]
  },
  {
    id: '6',
    title: 'TSLA',
    description: 'Tesla, Inc.',
    data: [267.3, 239.5, 233.4, 221.8, 272.5, 251.1, 252.6]
  },
  {
    id: '7',
    title: 'MSTR',
    description: 'MicroStrategy Incorporated',
    data: [281.9, 293.9, 268.4, 237.9, 296.8, 272.3, 299.9]
  },
  {
    id: '8',
    title: 'DJT',
    description: 'DJT Inc.',
    data: [18.4, 17, 17.3, 16.6, 20.2, 18.8, 18.9]
  }
];

// Define types for horizontal list items
interface ChartItem {
  type: 'chart';
  stockData: typeof updatedItems[0]; // Use the type of an item from updatedItems
}

interface NewsListItem {
  type: 'news';
  newsItem: NewsItem;
  symbol: string;
  articleIndex: number; // Index within the news array for this symbol
}

type HorizontalListItem = ChartItem | NewsListItem;

export default function ExploreScreen() {
  const labels = ['4/3', '4/4', '4/7', '4/8', '4/9', '4/10', '4/11'];
  // State to track the current horizontal page index for each stock item's ID
  const [currentViews, setCurrentViews] = useState<{ [key: string]: number }>({}); 
  // State to track the index of the currently active vertical item
  const [activeVerticalIndex, setActiveVerticalIndex] = useState<number>(0);
  const verticalListRef = useRef<FlatList>(null);
  const horizontalListRefs = useRef<{ [key: string]: FlatList | null }>({});

  // Updated PaginationDots to handle dynamic number of dots
  const PaginationDots = ({ currentView, totalPages }: { currentView: number; totalPages: number }) => (
    <View style={styles.pagination}>
      {Array.from({ length: totalPages }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            currentView === index && styles.paginationDotActive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={verticalListRef}
        data={updatedItems}
        pagingEnabled
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const newVerticalIndex = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
          if (newVerticalIndex !== activeVerticalIndex) {
            console.log(`Vertical scroll ended. New active index: ${newVerticalIndex}`);
            setActiveVerticalIndex(newVerticalIndex);
            
            // Scroll inactive horizontal lists back to the chart view
            Object.keys(horizontalListRefs.current).forEach(itemId => {
              // Find the index corresponding to this itemId
              const itemIndex = updatedItems.findIndex(item => item.id === itemId);
              if (itemIndex !== -1 && itemIndex !== newVerticalIndex) {
                  const horizontalList = horizontalListRefs.current[itemId];
                  if (horizontalList) {
                      console.log(`Scrolling horizontal list for item ${itemId} (index ${itemIndex}) to start.`);
                      horizontalList.scrollToOffset({ offset: 0, animated: false });
                      // Also reset its horizontal view state if needed, although scrolling should trigger onScroll
                      setCurrentViews(prev => ({ ...prev, [itemId]: 0 })); 
                  }
              }
            });
            // Ensure the new active item's horizontal state is set to 0 if not already
            const activeItemId = updatedItems[newVerticalIndex]?.id;
            if (activeItemId && currentViews[activeItemId] !== 0) {
                setCurrentViews(prev => ({ ...prev, [activeItemId]: 0 }));
            }
          }
        }}
        renderItem={({ item, index: verticalIndex }) => {
          const isPositive = item.data[0] < item.data[item.data.length - 1];
          const priceColor = isPositive ? '#00C805' : '#FF3B30';
          const priceChange = ((item.data[item.data.length - 1] - item.data[0]) / item.data[0] * 100).toFixed(2);
          const stockNews = mockNews[item.title as keyof typeof mockNews] || [];
          // Get the current horizontal index for THIS stock item (keyed by item.id)
          const currentHorizontalViewIndex = currentViews[item.id] || 0; 
          
          // Create the data for the horizontal FlatList
          const horizontalData: HorizontalListItem[] = [
            { type: 'chart', stockData: item }, 
            ...stockNews.map((news, newsIndex) => ({ 
              type: 'news' as const,
              newsItem: news,
              symbol: item.title,
              articleIndex: newsIndex
            }))
          ];
          
          const totalHorizontalPages = horizontalData.length;

          return (
            <View style={styles.pageContainer}>
              <FlatList
                ref={(ref) => horizontalListRefs.current[item.id] = ref}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={horizontalData} 
                keyExtractor={(hItem, hIndex) => hItem.type === 'chart' ? `chart-${item.id}` : `news-${hItem.newsItem.id}`}
                // Optimization: Prevent re-renders for off-screen items if possible
                // initialNumToRender={1} 
                // windowSize={3} // Adjust based on performance needs
                onScroll={(event) => {
                  const offsetX = event.nativeEvent.contentOffset.x;
                  const newPage = Math.round(offsetX / SCREEN_WIDTH);
                  if (currentViews[item.id] !== newPage) {
                    // console.log(`Horizontal scroll for ${item.title}: setting page to ${newPage}`);
                    setCurrentViews(prev => ({
                      ...prev,
                      [item.id]: newPage // Update state for THIS item.id
                    }));
                  }
                }}
                scrollEventThrottle={16} 
                renderItem={({ item: horizontalItem, index: horizontalIndex }) => {
                  // Determine if the current *vertical* item is the active one
                  const isCurrentVerticalItem = verticalIndex === activeVerticalIndex;
                  // Determine if the current *horizontal* page is the active one for this item
                  const isCurrentHorizontalPage = horizontalIndex === currentHorizontalViewIndex;
                  
                  // Audio should play only if BOTH vertical and horizontal views are active
                  const shouldPlayChartAudio = horizontalItem.type === 'chart' && isCurrentVerticalItem && isCurrentHorizontalPage;
                  const shouldPlayNewsAudio = horizontalItem.type === 'news' && isCurrentVerticalItem && isCurrentHorizontalPage;
                  
                  // Log audio flags for debugging
                  // if (horizontalItem.type === 'chart') {
                  //   console.log(`Chart   [V=${verticalIndex}, H=${horizontalIndex}]: ActiveV=${activeVerticalIndex}, CurrentHView=${currentHorizontalViewIndex} => Play=${shouldPlayChartAudio}`);
                  // } else {
                  //   console.log(`News    [V=${verticalIndex}, H=${horizontalIndex}]: ActiveV=${activeVerticalIndex}, CurrentHView=${currentHorizontalViewIndex} => Play=${shouldPlayNewsAudio}`);
                  // }

                  return (
                    <View style={[styles.page, { width: SCREEN_WIDTH }]}>
                      {horizontalItem.type === 'chart' ? (
                        // Chart View
                        <View style={styles.card}>
                          <View style={styles.header}>
                            <View>
                              <Text style={styles.symbol}>{horizontalItem.stockData.title}</Text>
                              <Text style={styles.companyName}>{horizontalItem.stockData.description}</Text>
                            </View>
                            <View style={styles.priceContainer}>
                              <Text style={[styles.price, { color: priceColor }]}>
                                ${horizontalItem.stockData.data[horizontalItem.stockData.data.length - 1]}
                              </Text>
                              <Text style={[styles.priceChange, { color: priceColor }]}>
                                {priceChange}%
                              </Text>
                            </View>
                          </View>
                          <StockChart
                            data={horizontalItem.stockData.data} 
                            labels={labels}
                            symbol={horizontalItem.stockData.title} 
                            shouldPlayDescriptionAudio={shouldPlayChartAudio} 
                          />
                        </View>
                      ) : (
                        // News View
                        <NewsCard
                          newsItem={horizontalItem.newsItem} 
                          symbol={horizontalItem.symbol}
                          articleIndex={horizontalItem.articleIndex} 
                          shouldPlayAudio={shouldPlayNewsAudio} 
                        />
                      )}
                    </View>
                  );
                }}
              />
              <PaginationDots currentView={currentHorizontalViewIndex} totalPages={totalHorizontalPages} />
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  pageContainer: {
    height: ITEM_HEIGHT,
    position: 'relative',
  },
  page: {
    height: ITEM_HEIGHT,
  },
  card: {
    height: ITEM_HEIGHT,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderRadius: 12,
    marginHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  symbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  companyName: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
  },
  priceChange: {
    fontSize: 14,
    marginTop: 4,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
  },
});
