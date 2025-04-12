import { FlatList, View, Text, StyleSheet, Dimensions} from 'react-native';

const ITEM_HEIGHT = Dimensions.get('window').height; // or your custom width
const ITEM_WIDTH = Dimensions.get('window').width;

const items = [
  { id: '1', title: 'Card 1', description: 'This is the first card' },
  { id: '2', title: 'Card 2', description: 'This is the second card' },
  { id: '3', title: 'Card 3', description: 'This is the third card' },
];

export default function TabTwoScreen() {
  return (
      <FlatList
      data={items}
      pagingEnabled
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      )}
      />
  );
}

const styles = StyleSheet.create({
  card: {
    height: ITEM_HEIGHT,
    width: '100%',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 4, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});
