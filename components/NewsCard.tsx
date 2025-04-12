import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import { audioAssets } from '../utils/assetMap';

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
  symbol: string;
  articleIndex: number;
  onNewsChange?: (index: number) => void;
}

const ITEM_HEIGHT = Dimensions.get('window').height;
const TOP_PADDING = Platform.OS === 'ios' ? 50 : 30;

export const NewsCard: React.FC<NewsCardProps> = ({ 
  news, 
  currentNewsIndex,
  symbol,
  articleIndex,
  onNewsChange
}) => {
  const currentNews = news[currentNewsIndex];
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading sound on cleanup');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playAudio = async () => {
    if (sound) {
      await sound.unloadAsync();
    }
    
    if (isPlayingAudio) {
      stopAudio();
    } else {
      try {
        console.log(`Loading audio for ${symbol} article ${articleIndex + 1}`);
        
        // Access the audio file directly based on symbol and index
        let audioFile;
        if (symbol === 'AAPL') {
          audioFile = articleIndex === 0 ? audioAssets.AAPL[1] : 
                      articleIndex === 1 ? audioAssets.AAPL[2] : 
                      articleIndex === 2 ? audioAssets.AAPL[3] : undefined;
        } else if (symbol === 'GOOG') {
          audioFile = articleIndex === 0 ? audioAssets.GOOG[1] : 
                      articleIndex === 1 ? audioAssets.GOOG[2] : 
                      articleIndex === 2 ? audioAssets.GOOG[3] : undefined;
        } else if (symbol === 'MSFT') {
          audioFile = articleIndex === 0 ? audioAssets.MSFT[1] : 
                      articleIndex === 1 ? audioAssets.MSFT[2] : 
                      articleIndex === 2 ? audioAssets.MSFT[3] : undefined;
        }
        
        if (audioFile) {
          const { sound } = await Audio.Sound.createAsync(audioFile);
          setSound(sound);
          await sound.playAsync();
          setIsPlayingAudio(true);
          
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              setIsPlayingAudio(false);
            }
          });
        } else {
          console.log(`Audio file not found for ${symbol} article ${articleIndex + 1}`);
        }
      } catch (error) {
        console.error('Error playing audio:', error);
        setIsPlayingAudio(false);
      }
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.unloadAsync();
      setIsPlayingAudio(false);
    }
  };

  useEffect(() => {
    playAudio();
    return () => {
      if (sound) {
        console.log('Cleaning up sound on unmount');
        sound.unloadAsync();
      }
    };
  }, [currentNewsIndex, symbol, articleIndex]);

  const goToNextNews = () => {
    if (onNewsChange && currentNewsIndex < news.length - 1) {
      onNewsChange(currentNewsIndex + 1);
    }
  };

  const goToPrevNews = () => {
    if (onNewsChange && currentNewsIndex > 0) {
      onNewsChange(currentNewsIndex - 1);
    }
  };

  // News navigation dots
  const renderNewsDots = () => (
    <View style={styles.newsDots}>
      {news.map((_, index) => (
        <TouchableOpacity 
          key={index} 
          style={[
            styles.newsDot, 
            index === currentNewsIndex && styles.activeNewsDot
          ]}
          onPress={() => onNewsChange && onNewsChange(index)}
        />
      ))}
    </View>
  );

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
        
        {/* News navigation controls */}
        <View style={styles.newsControls}>
          <TouchableOpacity 
            style={[styles.navButton, currentNewsIndex === 0 && styles.disabledButton]} 
            onPress={goToPrevNews}
            disabled={currentNewsIndex === 0}
          >
            <Text style={styles.navButtonText}>← Prev</Text>
          </TouchableOpacity>
          
          {renderNewsDots()}
          
          <TouchableOpacity 
            style={[styles.navButton, currentNewsIndex === news.length - 1 && styles.disabledButton]} 
            onPress={goToNextNews}
            disabled={currentNewsIndex === news.length - 1}
          >
            <Text style={styles.navButtonText}>Next →</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    lineHeight: 32,
  },
  dateSource: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  newsControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
  },
  navButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.5,
  },
  newsDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  activeNewsDot: {
    backgroundColor: '#FFFFFF',
  }
}); 