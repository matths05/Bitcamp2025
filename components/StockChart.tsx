import React, { useState, useRef, useEffect, memo } from 'react';
import { StyleSheet, View, Text, Dimensions, PanResponder, TouchableWithoutFeedback } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Audio } from 'expo-av';
import { audioAssets } from '../utils/assetMap';

interface StockChartProps {
  // Support both ways of providing data - either direct data props or symbol for loading
  data?: number[];
  labels?: string[];
  symbol?: string;
  shouldPlayDescriptionAudio: boolean;
}

interface TooltipData {
  x: number;
  y: number;
  value: number;
  index: number;
}

const screenWidth = Dimensions.get('window').width;

const symbolToAudioMap: Record<string, keyof typeof audioAssets | null> = {
  'AAPL': 'AAPL',
  'INTC': 'INTC',
  'NET': 'NET',
  'PLTR': 'PLTR',
  'APP': 'APP',
  'TSLA': 'TSLA',
  'MSTR': 'MSTR',
  'DJT': 'DJT'
};

const Tooltip: React.FC<{ data: TooltipData; labels: string[] }> = ({ data, labels }) => {
  if (!data) return null;
  // Ensure index is within bounds for labels array
  const date = (labels && data.index >= 0 && data.index < labels.length) ? labels[data.index] : 'N/A';
  return (
    <View style={[styles.tooltip, { left: data.x - 40, top: data.y - 40 }]}>
      <Text style={styles.tooltipText}>Price: ${data.value.toFixed(2)}</Text>
      <Text style={styles.tooltipText}>Date: {date}</Text>
    </View>
  );
};

export const StockChart: React.FC<StockChartProps> = memo(({ data: propData, labels: propLabels, symbol, shouldPlayDescriptionAudio }) => {
  const [data, setData] = useState<number[]>(propData || []);
  const [labels, setLabels] = useState<string[]>(propLabels || []);
  const [tooltipPos, setTooltipPos] = useState<TooltipData | null>(null);
  const [sound, setSound] = useState<Audio.Sound>();
  console.log(`Should Play Description Audio ${shouldPlayDescriptionAudio}`);

  // If props change, update the state
  useEffect(() => {
    if (propData) setData(propData);
    if (propLabels) setLabels(propLabels);
  }, [propData, propLabels]);

  const isPositive = data.length > 0 && data[0] < data[data.length - 1];
  const chartColor = isPositive ? 'rgba(0, 200, 5, 1)' : 'rgba(255, 59, 48, 1)';

  // --- Audio Handling Logic Start ---
  useEffect(() => {
    return () => {
      if (sound) {
        console.log(`Unloading description sound for ${symbol || 'unknown symbol'}`);
        sound.unloadAsync();
        setSound(undefined);
      }
    };
  }, [sound, symbol]);

  const playDescriptionAudio = async () => {
    console.log("1111111");
    if (!symbol) {
      console.warn('playDescriptionAudio called without a symbol.');
      return;
    }
    
    if (sound) {
      await sound.stopAsync(); 
      await sound.unloadAsync();
      setSound(undefined);
    }

    if (!shouldPlayDescriptionAudio) {
        return;
    }

    try {
      console.log(`Loading description audio for ${symbol}`);
      let audioFile;
      const audioKey = symbolToAudioMap[symbol];
      
      // --- FIXED LOOKUP --- 
      // Access the description audio using the 'description' key
      if (audioKey && audioAssets[audioKey] && audioAssets[audioKey].description) {
          audioFile = audioAssets[audioKey].description;
      } else {
          console.warn(`Audio key not found in map or description audio not found in assets for symbol: ${symbol}`);
      }
      // --- END OF FIXED LOOKUP ---

      if (audioFile) {
        const { sound: newSound } = await Audio.Sound.createAsync(audioFile);
        setSound(newSound);
        console.log(`Playing description audio for ${symbol}`);
        await newSound.playAsync();

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            console.log(`Finished playing description audio for ${symbol}`);
          }
        });
      } else {
        console.log(`Description audio file could not be determined or loaded for ${symbol}`);
      }
    } catch (error) {
      console.error(`Error playing description audio for ${symbol}:`, error);
    }
  };

  useEffect(() => {
    if (!symbol) return;
    
    if (shouldPlayDescriptionAudio) {
      playDescriptionAudio();
    } else {
      if (sound) {
        console.log(`Stopping description sound for ${symbol} as it's no longer the active chart`);
        sound.stopAsync();
        sound.unloadAsync();
        setSound(undefined);
      }
    }
  }, [shouldPlayDescriptionAudio, symbol]);
  // --- Audio Handling Logic End ---

  const handleTouchEnd = () => {
    setTooltipPos(null);
  };

  const chartConfig = {
    backgroundColor: '#000000',
    backgroundGradientFrom: '#000000',
    backgroundGradientTo: '#000000',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: chartColor,
      fill: '#000000',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: 'rgba(255, 255, 255, 0.1)',
    },
    propsForLabels: {
      fontSize: 12,
      fill: 'rgba(255, 255, 255, 0.5)',
    },
    fillShadowGradient: chartColor,
    fillShadowGradientOpacity: 0.1,
  };

  if (data.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading chart data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPressOut={handleTouchEnd}>
        <View>
          <LineChart
            data={{
              labels,
              datasets: [{
                data,
                color: (opacity = 1) => chartColor,
              }]
            }}
            width={screenWidth - 48}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withDots={true}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={false}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            yAxisLabel="$"
            yAxisSuffix=""
            onDataPointClick={(dataPoint) => {
              setTooltipPos({ 
                x: dataPoint.x, 
                y: dataPoint.y, 
                value: dataPoint.value, 
                index: dataPoint.index 
              });
            }}
            decorator={() => tooltipPos ? <Tooltip data={tooltipPos} labels={labels} /> : null}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  loadingContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fff',
    zIndex: 10,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 12,
  },
}); 