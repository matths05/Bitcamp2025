import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, PanResponder } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface StockChartProps {
  // Support both ways of providing data - either direct data props or symbol for loading
  data?: number[];
  labels?: string[];
  symbol?: string;
}

export const StockChart: React.FC<StockChartProps> = ({ data: propData, labels: propLabels, symbol }) => {
  const [data, setData] = useState<number[]>(propData || []);
  const [labels, setLabels] = useState<string[]>(propLabels || []);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number; visible: boolean; value: string; label: string }>({
    x: 0,
    y: 0,
    visible: false,
    value: '',
    label: ''
  });

  // If props change, update the state
  useEffect(() => {
    if (propData) setData(propData);
    if (propLabels) setLabels(propLabels);
  }, [propData, propLabels]);

  const isPositive = data.length > 0 && data[0] < data[data.length - 1];
  const chartColor = isPositive ? '#00C805' : '#FF3B30';
  const screenWidth = Dimensions.get('window').width;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        updateTooltip(locationX, locationY);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        updateTooltip(locationX, locationY);
      },
      onPanResponderRelease: () => {
        setTooltipPos(prev => ({ ...prev, visible: false }));
      }
    })
  ).current;

  const updateTooltip = (locationX: number, locationY: number) => {
    if (data.length === 0) return;
    
    const chartWidth = screenWidth - 48;
    const stepWidth = chartWidth / (data.length - 1);
    const index = Math.round(locationX / stepWidth);
    
    if (index >= 0 && index < data.length) {
      setTooltipPos({
        x: locationX,
        y: locationY,
        visible: true,
        value: data[index].toFixed(2),
        label: labels[index] || ''
      });
    }
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

  const Tooltip = () => {
    if (!tooltipPos.visible) return null;
    return (
      <View
        style={[
          styles.tooltip,
          {
            left: tooltipPos.x - 40,
            top: tooltipPos.y - 70,
          },
        ]}>
        <Text style={styles.tooltipPrice}>${tooltipPos.value}</Text>
        <Text style={styles.tooltipDate}>{tooltipPos.label}</Text>
      </View>
    );
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
      <View {...panResponder.panHandlers}>
        <LineChart
          data={{
            labels,
            datasets: [{
              data,
              color: () => chartColor,
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
        />
        <Tooltip />
      </View>
    </View>
  );
};

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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tooltipPrice: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tooltipDate: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    marginTop: 4,
  },
}); 