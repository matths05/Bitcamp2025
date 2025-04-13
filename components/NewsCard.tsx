import React, { useEffect, useState, memo } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import { audioAssets } from '../utils/assetMap';

// Export NewsItem
export interface NewsItem {
  id: string;
  title: string;
  date: string;
  source: string;
  content: string;
}

interface NewsCardProps {
  newsItem: NewsItem;
  symbol: string;
  articleIndex: number;
  shouldPlayAudio: boolean;
}

const ITEM_HEIGHT = Dimensions.get('window').height;
const TOP_PADDING = Platform.OS === 'ios' ? 50 : 30;

// Map stock symbols to audio asset keys
const symbolToAudioMap: Record<string, keyof typeof audioAssets> = {
  'AAPL': 'AAPL',
  'APP': 'APP',
  'INTC': 'INTC',
  'TSLA': 'TSLA',
  'PLTR': 'PLTR',
  'NET': 'NET',
  'MSTR': 'MSTR',
  'DJT': 'DJT'
};

// Use memo to prevent unnecessary re-renders when props haven't changed
export const NewsCard: React.FC<NewsCardProps> = memo(({ 
  newsItem, 
  symbol,
  articleIndex,
  shouldPlayAudio
}) => {
  const currentNews = newsItem;
  const [sound, setSound] = useState<Audio.Sound>();

  useEffect(() => {
    return () => {
      if (sound) {
        console.log(`Unloading sound for ${symbol} article ${articleIndex + 1}`);
        sound.unloadAsync();
        setSound(undefined);
      }
    };
  }, [sound]);

  const playAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(undefined);
    }

    if (!shouldPlayAudio) {
      return;
    }

    try {
      console.log(`Loading audio for ${symbol} article ${articleIndex + 1}`);
      
      let audioFile;
      const audioKey = symbolToAudioMap[symbol];
      
      if (audioKey && audioAssets[audioKey]) {
        const audioIndex = articleIndex + 1;
        if (audioIndex >= 1 && audioIndex <= 3) {
          audioFile = audioAssets[audioKey][audioIndex as 1 | 2 | 3];
        }
      }
      
      if (audioFile) {
        const { sound: newSound } = await Audio.Sound.createAsync(audioFile);
        setSound(newSound);
        console.log(`Playing audio for ${symbol} article ${articleIndex + 1}`);
        await newSound.playAsync();
        
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            console.log(`Finished playing audio for ${symbol} article ${articleIndex + 1}`);
          }
        });
      } else {
        console.log(`Audio file not found for ${symbol} article ${articleIndex + 1}`);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  useEffect(() => {
    if (shouldPlayAudio) {
      playAudio();
    } else {
      if (sound) {
        console.log(`Stopping sound for ${symbol} article ${articleIndex + 1} as it's no longer active`);
        sound.stopAsync();
        sound.unloadAsync(); 
        setSound(undefined);
      }
    }
  }, [shouldPlayAudio, symbol, articleIndex]);

  return (
    <View style={[styles.container, { paddingTop: TOP_PADDING }]}>
      <View style={styles.newsCard}>
        <View style={styles.header}>
          <Text style={styles.title}>{currentNews.title}</Text>
          <View style={styles.dateSource}>
            <Text style={styles.date}>{currentNews.date}</Text>
            <Text style={styles.source}>{currentNews.source}</Text>
          </View>
        </View>
        <ScrollView
          style={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.content}>{currentNews.content}</Text>
        </ScrollView>
      </View>
    </View>
  );
});

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
  header: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 32,
  },
  dateSource: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginRight: 8,
  },
  source: {
    fontSize: 14,
    color: '#00C805',
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
  }
}); 