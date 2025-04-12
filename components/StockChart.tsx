import React from 'react';
import { StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

interface StockChartProps {
  data: number[];
  labels: string[];
}

export const StockChart: React.FC<StockChartProps> = ({ data, labels }) => {
  const isPositive = data[0] < data[data.length - 1];
  const chartColor = isPositive ? '#00C805' : '#FF3B30';
  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundColor: '#000000',
    backgroundGradientFrom: '#000000',
    backgroundGradientTo: '#000000',
    decimalPlaces: 0,
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
      strokeDasharray: '', // solid lines
      stroke: 'rgba(255, 255, 255, 0.1)',
    },
    propsForLabels: {
      fontSize: 12,
      fill: 'rgba(255, 255, 255, 0.5)',
    },
    fillShadowGradient: chartColor,
    fillShadowGradientOpacity: 0.1,
  };

  return (
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
      withDots={false}
      withInnerLines={false}
      withOuterLines={false}
      withVerticalLines={false}
      withHorizontalLines={false}
      withVerticalLabels={true}
      withHorizontalLabels={true}
      yAxisLabel="$"
      yAxisSuffix=""
    />
  );
};

const styles = StyleSheet.create({
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
}); 