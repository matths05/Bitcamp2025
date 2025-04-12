import { FlatList, View, Text, StyleSheet, Dimensions } from 'react-native';
import { StockChart } from '@/components/StockChart';
import { NewsCard } from '@/components/NewsCard';
import { useState, useRef } from 'react';

const ITEM_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

// Mock news data (replace with real data later)
const mockNews = {
  'AAPL': [
    {
      id: '1',
      title: "Apple's Vision Pro Launch Marks Major Milestone",
      date: 'Feb 2, 2024',
      source: 'TechCrunch',
      content: "Apple's highly anticipated Vision Pro headset launches today, marking the company's first major new product category since the Apple Watch..."
    },
    {
      id: '2',
      title: 'Apple Reports Record Q1 Earnings',
      date: 'Feb 1, 2024',
      source: 'Bloomberg',
      content: 'Apple Inc. reported stronger-than-expected quarterly earnings, driven by iPhone sales and continued growth in services revenue...'
    }
  ],
  'GOOG': [
    {
      id: '1',
      title: 'Google Announces Major AI Advancements',
      date: 'Feb 2, 2024',
      source: 'The Verge',
      content: 'Google unveiled its latest AI model, demonstrating significant improvements in natural language understanding and generation...'
    }
  ],
  'MSFT': [
    {
      id: '1',
      title: 'Microsoft Cloud Revenue Soars',
      date: 'Feb 1, 2024',
      source: 'Reuters',
      content: 'Microsoft reported exceptional growth in its cloud computing division, with Azure revenue exceeding analyst expectations...'
    }
  ]
};

const items = [
  { 
    id: '1', 
    title: 'AAPL', 
    description: 'Apple Inc.',
    data: [120, 125, 130, 128, 135, 140, 145]
  },
  { 
    id: '2', 
    title: 'GOOG',
    description: 'Alphabet Inc.',
    data: [2800, 2850, 2900, 2950, 3000, 3050, 3100]
  },
  { 
    id: '3', 
    title: 'MSFT', 
    description: 'Microsoft Corporation',
    data: [400, 325, 330, 335, 340, 345, 350]
  },
];

export default function TabTwoScreen() {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
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
        data={items}
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
