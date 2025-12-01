import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';

const restaurants = [
  {
    id: '1',
    name: 'Golden Bar & Grill ($$)',
    image: require('../../../assets/Images/Restaurants/cuisineGreek.jpg'),
    rating: 4,
  },
  {
    id: '2',
    name: 'WJU Eats ($$)',
    image: require('../../../assets/Images/Restaurants/cuisineJapanese.jpg'),
    rating: 4,
  },
  {
    id: '3',
    name: 'Sweet Dragon ($)',
    image: require('../../../assets/Images/Restaurants/cuisineSoutheast.jpg'),
    rating: 4,
  },
  {
    id: '4',
    name: 'Golden Creamery ($)',
    image: require('../../../assets/Images/Restaurants/cuisineViet.jpg'),
    rating: 4,
  },
  {
    id: '5',
    name: 'Pizza Paradise ($$)',
    image: require('../../../assets/Images/Restaurants/cuisinePizza.jpg'),
    rating: 4,
  },
  {
    id: '6',
    name: 'Pasta House ($$)',
    image: require('../../../assets/Images/Restaurants/cuisinePasta.jpg'),
    rating: 4,
  },
];

export default function RestaurantsScreen() {
  const renderStars = (count: number) => {
    return '★'.repeat(count);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../../assets/Images/AppLogoV1.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>LOG OUT</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.sectionTitle}>NEARBY RESTAURANTS</Text>
      </View>

      <View style={styles.filterSection}>
        <View style={styles.filterColumn}>
          <Text style={styles.filterLabel}>Rating</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>-- Select --</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.filterColumn}>
          <Text style={styles.filterLabel}>Price</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>-- Select --</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.restaurantsTitleSection}>
        <Text style={styles.restaurantsTitle}>RESTAURANTS</Text>
      </View>

      <FlatList
        data={restaurants}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={item.image} style={styles.restaurantImage} />
            <View style={styles.cardContent}>
              <Text style={styles.restaurantName}>{item.name}</Text>
              <Text style={styles.stars}>{renderStars(item.rating)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIcon}>
            <Text style={styles.navIconText}>🍔</Text>
          </View>
          <Text style={styles.navLabel}>Restaurants</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIcon}>
            <Text style={styles.navIconText}>🕐</Text>
          </View>
          <Text style={styles.navLabel}>OrderHistory</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logo: {
    width: 150,
    height: 40,
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  filterSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 16,
  },
  filterColumn: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  restaurantsTitleSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
  },
  restaurantsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  cardContent: {
    padding: 12,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  stars: {
    fontSize: 14,
    color: '#333',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  navIconText: {
    fontSize: 20,
  },
  navLabel: {
    fontSize: 12,
    color: '#666',
  },
});
