import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function RestaurantMenuScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { restaurant } = route.params as any;

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image source={restaurant.image} style={styles.headerImage} />
        <View style={styles.content}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.stars}>{('★').repeat(restaurant.rating)}</Text>
          
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Menu</Text>
            <Text style={styles.comingSoon}>Menu items coming soon...</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 20,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  stars: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  menuSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  comingSoon: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
});
