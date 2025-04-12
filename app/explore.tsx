import { FlatList, View, Text, StyleSheet, Dimensions } from 'react-native';
import { StockChart } from '../components/StockChart';
import { NewsCard } from '../components/NewsCard';
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
      content: "US President puts 90-days pause on tariffs, impacting the tech industry including Apple."
    },
    {
      id: '2',
      title: "Trump Administration Grants Tariff Reprieve To Tech Industry; Apple And Nvidia Among Beneficiaries",
      date: 'April 12, 2025',
      source: 'Benzinga',
      content: "The Trump administration has granted a tariff reprieve to the tech industry, with Apple and Nvidia among the beneficiaries."
    },
    {
      id: '3',
      title: "Bulls And Bears: Apple, Nike, US Steel - And The Markets Ride Out Ongoing Volatility",
      date: 'April 12, 2025',
      source: 'Benzinga',
      content: "Market analysis featuring Apple, Nike, and US Steel as markets continue to experience volatility."
    }
  ],
  'INTC': [
    {
      id: '1',
      title: "Consumer Tech News: US President Puts 90-Days Pause On Tariffs, Microsoft May Cut Jobs & More",
      date: 'April 12, 2025',
      source: 'Benzinga',
      content: "US President puts 90-days pause on tariffs, potentially impacting Intel among other tech companies."
    },
    {
      id: '2',
      title: "1 Artificial Intelligence Stock I'm Buying Hand Over First While It's Down 30%",
      date: 'April 12, 2025',
      source: 'The Motley Fool',
      content: "Analysis of an AI stock that's currently down 30%, possibly referencing Intel as an investment opportunity."
    },
    {
      id: '3',
      title: "Trump Tariff Wars: China's New Rule To Exempt Nvidia, Qualcomm And Others From Levies, But These Chip Companies Will Be Hit With 125% Tariffs",
      date: 'April 12, 2025',
      source: 'Benzinga',
      content: "China has implemented new tariff rules that exempt certain chip companies like Nvidia and Qualcomm, while others may face 125% tariffs."
    }
  ],
  'NET': [
    {
      id: '1',
      title: "Top Technology Executives Recognized at the 2025 SeattleCIO ORBIE Awards",
      date: 'April 11, 2025',
      source: 'Benzinga',
      content: "Recognition of top technology executives at the 2025 SeattleCIO ORBIE Awards."
    },
    {
      id: '2',
      title: "Deal Dispatch: Harley-Davidson To Wipe Out? Plus, Prada's Versace Purchase Garners A Fashionable Price",
      date: 'April 11, 2025',
      source: 'Benzinga',
      content: "Business deals update including potential Harley-Davidson developments and Prada's purchase of Versace."
    },
    {
      id: '3',
      title: "StarkWare researchers propose smart contracts for Bitcoin with ColliderVM",
      date: 'April 11, 2025',
      source: 'CoinTelegraph',
      content: "StarkWare researchers have proposed a new method for implementing smart contracts for Bitcoin using ColliderVM technology."
    }
  ],
  'PLTR': [
    {
      id: '1',
      title: "Stock Market Crash: Is Palantir a Buy?",
      date: 'April 12, 2025',
      source: 'The Motley Fool',
      content: "Analysis of whether Palantir represents a good buying opportunity during a stock market downturn."
    },
    {
      id: '2',
      title: "Should You Forget Palantir and Buy This Artificial Intelligence (AI) Stock Instead?",
      date: 'April 12, 2025',
      source: 'The Motley Fool',
      content: "Comparison between Palantir and another AI stock, evaluating which might be a better investment opportunity."
    },
    {
      id: '3',
      title: "Prediction: 2 AI Stocks Will Be Worth More Than Palantir Technologies by Early 2026",
      date: 'April 12, 2025',
      source: 'The Motley Fool',
      content: "Analysis predicting that two AI stocks will surpass Palantir Technologies in market value by early 2026."
    }
  ],
  'APP': [
    {
      id: '1',
      title: "AppLovin Corporation Investors: May 5, 2025 Filing Deadline in Securities Class Action",
      date: 'April 11, 2025',
      source: 'Benzinga',
      content: "Notification about May 5, 2025 filing deadline in securities class action for AppLovin Corporation investors."
    },
    {
      id: '2',
      title: "Tech Stocks Soared This Week, but Uncertainty Persists",
      date: 'April 11, 2025',
      source: 'The Motley Fool',
      content: "Analysis of tech stocks performance this week with mention of ongoing uncertainty in the market."
    },
    {
      id: '3',
      title: "Tech stocks head for winning week with Nvidia tracking for 15% bounceback",
      date: 'April 11, 2025',
      source: 'CNBC',
      content: "Tech stocks are heading for a winning week with Nvidia tracking for a 15% recovery."
    }
  ],
  'TSLA': [
    {
      id: '1',
      title: "Consumer Tech News: US President Puts 90-Days Pause On Tariffs, Microsoft May Cut Jobs & More",
      date: 'April 12, 2025',
      source: 'Benzinga',
      content: "US President puts 90-days pause on tariffs, potentially affecting Tesla among other tech companies."
    },
    {
      id: '2',
      title: "Warren Buffett's Wealth Grows Even Amid Tariff War and Global Market Turmoil",
      date: 'April 12, 2025',
      source: 'Benzinga',
      content: "Warren Buffett's wealth continues to grow despite ongoing tariff war and global market turmoil, with mentions of Tesla."
    },
    {
      id: '3',
      title: "Elon Musk's Cybertruck Is Controversial, But Kids Love It",
      date: 'April 12, 2025',
      source: 'Benzinga',
      content: "While Tesla's Cybertruck has been controversial among adults, it appears to be popular with children."
    }
  ],
  'MSTR': [
    {
      id: '1',
      title: "Insider Trading: 3 CEOs Recently Buying Shares",
      date: 'April 11, 2025',
      source: 'Zacks',
      content: "Report on three CEOs who have recently purchased shares of their own companies."
    },
    {
      id: '2',
      title: "Q2 Bitcoin ETF Outlook: Is It a Safer Exposure?",
      date: 'April 11, 2025',
      source: 'Zacks',
      content: "Analysis of Bitcoin ETF outlook for Q2, discussing whether it offers safer exposure compared to direct cryptocurrency investments."
    },
    {
      id: '3',
      title: "Crypto-focused Janover skyrockets after completing its first Solana purchase",
      date: 'April 10, 2025',
      source: 'CNBC',
      content: "Crypto-focused company Janover sees significant stock price increase after completing its first Solana purchase."
    }
  ],
  'DJT': [
    {
      id: '1',
      title: "TMTG Form S-3 Registration Statement Becomes Effective",
      date: 'April 11, 2025',
      source: 'GlobeNewswire',
      content: "Trump Media & Technology Group's Form S-3 Registration Statement has become effective."
    },
    {
      id: '2',
      title: "Trump Media Ventures Into Canada And Mexico Amid Global Tariff Tensions",
      date: 'April 10, 2025',
      source: 'Benzinga',
      content: "Trump Media is expanding operations into Canada and Mexico amid ongoing global tariff tensions."
    },
    {
      id: '3',
      title: "Trump Pauses Tariffs After Yields Surge: 'Bond Vigilantes Hit Another Homerun,' Experts Point To Bond Market Panic For Reversal",
      date: 'April 10, 2025',
      source: 'Benzinga',
      content: "President Trump has paused tariffs following a surge in yields, with experts attributing the decision to bond market pressure."
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


export default function ExploreScreen() {
  const labels = ['4/3', '4/4', '4/7', '4/8', '4/9', '4/10', '4/11'];
  const [currentNewsIndices, setCurrentNewsIndices] = useState<{ [key: string]: number }>({});
  const [currentViews, setCurrentViews] = useState<{ [key: string]: number }>({});
  const verticalListRef = useRef<FlatList>(null);
  const horizontalListRefs = useRef<{ [key: string]: FlatList | null }>({});

  const handleVerticalScroll = (index: number) => {
    // Reset to chart view when navigating between stocks
    Object.keys(currentViews).forEach(key => {
      const horizontalList = horizontalListRefs.current[key];
      if (horizontalList) {
        horizontalList.scrollToOffset({ offset: 0, animated: false });
      }
    });
    setCurrentViews({});
  };

  const handleNewsChange = (symbol: string, newsIndex: number) => {
    console.log(`Changing news for ${symbol} to index ${newsIndex}`);
    setCurrentNewsIndices(prev => ({
      ...prev,
      [symbol]: newsIndex
    }));
  };

  const PaginationDots = ({ currentView }: { currentView: number }) => (
    <View style={styles.pagination}>
      <View 
        style={[
          styles.paginationDot, 
          currentView === 0 && styles.paginationDotActive
        ]} 
      />
      <View 
        style={[
          styles.paginationDot, 
          currentView === 1 && styles.paginationDotActive
        ]} 
      />
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
          const index = Math.floor(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
          handleVerticalScroll(index);
        }}
        renderItem={({ item, index }) => {
          const isPositive = item.data[0] < item.data[item.data.length - 1];
          const priceColor = isPositive ? '#00C805' : '#FF3B30';
          const priceChange = ((item.data[item.data.length - 1] - item.data[0]) / item.data[0] * 100).toFixed(2);
          const stockNews = mockNews[item.title as keyof typeof mockNews] || [];
          const currentView = currentViews[item.id] || 0;
          
          return (
            <View style={styles.pageContainer}>
              <FlatList
                ref={(ref) => horizontalListRefs.current[item.id] = ref}
                horizontal
                pagingEnabled
                initialScrollIndex={0}
                showsHorizontalScrollIndicator={false}
                data={[1, 2]} // 1 for chart, 2 for news
                keyExtractor={(_, index) => index.toString()}
                onScroll={(event) => {
                  const offsetX = event.nativeEvent.contentOffset.x;
                  const newPage = Math.round(offsetX / SCREEN_WIDTH);
                  if (currentViews[item.id] !== newPage) {
                    setCurrentViews(prev => ({
                      ...prev,
                      [item.id]: newPage
                    }));
                  }
                }}
                scrollEventThrottle={16}
                renderItem={({ index: horizontalIndex }) => (
                  <View style={[styles.page, { width: SCREEN_WIDTH }]}>
                    {horizontalIndex === 0 ? (
                      // Chart View
                      <View style={styles.card}>
                        <View style={styles.header}>
                          <View>
                            <Text style={styles.symbol}>{item.title}</Text>
                            <Text style={styles.companyName}>{item.description}</Text>
                          </View>
                          <View style={styles.priceContainer}>
                            <Text style={[styles.price, { color: priceColor }]}>
                              ${item.data[item.data.length - 1]}
                            </Text>
                            <Text style={[styles.priceChange, { color: priceColor }]}>
                              {priceChange}%
                            </Text>
                          </View>
                        </View>
                        <StockChart data={item.data} labels={labels} />
                      </View>
                    ) : (
                      // News View
                      <View style={styles.card}>
                        <NewsCard
                          news={stockNews}
                          currentNewsIndex={currentNewsIndices[item.title] || 0}
                          symbol={item.title}
                          articleIndex={(currentNewsIndices[item.title] || 0) + 1}
                          onNewsChange={(newsIndex) => handleNewsChange(item.title, newsIndex)}
                        />
                      </View>
                    )}
                  </View>
                )}
              />
              <PaginationDots currentView={currentView} />
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