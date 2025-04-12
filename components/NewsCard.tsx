import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface NewsItem {
  id: string;
  title: string;
  date: string;
  source: string;
  content: string;
}

interface NewsCardProps {
  news: NewsItem[];
  currentNewsIndex: number;
}

const ITEM_HEIGHT = Dimensions.get('window').height;

export const NewsCard: React.FC<NewsCardProps> = ({ news, currentNewsIndex }) => {
  const currentNews = news[currentNewsIndex];

  return (
    <View style={styles.container}>
      <View style={styles.newsCard}>
        <Text style={styles.source}>{currentNews.source}</Text>
        <Text style={styles.date}>{currentNews.date}</Text>
        <Text style={styles.title}>{currentNews.title}</Text>
        <Text style={styles.content}>{currentNews.content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT,
    padding: 24,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  newsCard: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  source: {
    fontSize: 14,
    color: '#00C805',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 32,
  },
  content: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
  },
}); 