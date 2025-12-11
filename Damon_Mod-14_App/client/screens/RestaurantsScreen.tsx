import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  StatusBar,
  Modal,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { restaurantService } from '../services/apiService';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Details: undefined;
  AccountTypeSelection: {
    customerId?: number;
    courierId?: number;
  };
  CustomerAccount: undefined;
  CourierAccount: undefined;
  Restaurants: undefined;
  RestaurantMenu: { restaurant: any };
  OrderHistory: undefined;
};

interface Restaurant {
  id: number;
  name: string;
  rating: number;
  price_range: number;
  active: boolean;
}

const restaurantImages: { [key: string]: any } = {
  Greek: require('../assets/Images/Restaurants/cuisineGreek.jpg'),
  Japanese: require('../assets/Images/Restaurants/cuisineJapanese.jpg'),
  Southeast: require('../assets/Images/Restaurants/cuisineSoutheast.jpg'),
  Vietnamese: require('../assets/Images/Restaurants/cuisineViet.jpg'),
  Pizza: require('../assets/Images/Restaurants/cuisinePizza.jpg'),
  Pasta: require('../assets/Images/Restaurants/cuisinePasta.jpg'),
  default: require('../assets/Images/RestaurantMenu.jpg'),
};

const getPriceString = (priceRange: number): string => {
  return '$'.repeat(priceRange);
};

const getRestaurantImage = (name: string) => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('greek')) return restaurantImages.Greek;
  if (nameLower.includes('japanese')) return restaurantImages.Japanese;
  if (nameLower.includes('dragon') || nameLower.includes('southeast'))
    return restaurantImages.Southeast;
  if (nameLower.includes('viet')) return restaurantImages.Vietnamese;
  if (nameLower.includes('pizza')) return restaurantImages.Pizza;
  if (nameLower.includes('pasta')) return restaurantImages.Pasta;
  return restaurantImages.default;
};

export default function RestaurantsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await restaurantService.getAll(
        selectedRating || undefined,
        selectedPrice || undefined
      );
      setRestaurants(data);
    } catch (err) {
      console.error('Error loading restaurants:', err);
      setError('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadRestaurants();
    }, [selectedRating, selectedPrice])
  );

  const renderStars = (count: number) => {
    return '★'.repeat(count);
  };

  const filteredRestaurants = useMemo(() => {
    return restaurants;
  }, [restaurants]);

  const handleRestaurantPress = (restaurant: any) => {
    navigation.navigate('RestaurantMenu', { restaurant });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../assets/Images/AppLogoV2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Pressable
            style={styles.logoutButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.logoutText}>LOG OUT</Text>
          </Pressable>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.sectionTitle}>NEARBY RESTAURANTS</Text>
        </View>

        {/* Filters */}
        <View style={styles.filterSection}>
          <View style={styles.filterColumn}>
            <Text style={styles.filterLabel}>Rating</Text>
            <Pressable
              style={styles.filterButton}
              onPress={() => setShowRatingModal(true)}
            >
              <Text style={styles.filterButtonText}>
                {selectedRating ? renderStars(selectedRating) : '-- Select --'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </Pressable>
          </View>
          <View style={styles.filterColumn}>
            <Text style={styles.filterLabel}>Price</Text>
            <Pressable
              style={styles.filterButton}
              onPress={() => setShowPriceModal(true)}
            >
              <Text style={styles.filterButtonText}>
                {selectedPrice ? getPriceString(selectedPrice) : '-- Select --'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </Pressable>
          </View>
        </View>

        {/* Restaurants header */}
        <View style={styles.restaurantsTitleSection}>
          <Text style={styles.restaurantsTitle}>RESTAURANTS</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#DA583B" />
              <Text style={styles.loadingText}>Loading restaurants...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={loadRestaurants}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : filteredRestaurants.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No restaurants found</Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your filters
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredRestaurants}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              style={styles.list}
              contentContainerStyle={styles.listContainer}
              columnWrapperStyle={styles.row}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => handleRestaurantPress(item)}
                >
                  <Image
                    source={getRestaurantImage(item.name)}
                    style={styles.restaurantImage}
                  />
                  <View style={styles.cardContent}>
                    <Text style={styles.restaurantName}>{item.name}</Text>
                    <Text style={styles.stars}>{renderStars(item.rating)}</Text>
                    <Text style={styles.priceText}>
                      {getPriceString(item.price_range)}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        {/* Rating Filter "Modal" */}
        {/* Rating Filter Modal */}
<Modal
  visible={showRatingModal}
  transparent
  animationType="fade"
  onRequestClose={() => setShowRatingModal(false)} // Android back button
>
  <Pressable
    style={styles.modalOverlay}
    onPress={() => setShowRatingModal(false)}      // tap outside = close
  >
    <Pressable
      style={styles.modalContent}
      onPress={() => {}}                           // absorb tap, don't close
    >
      <Text style={styles.modalTitle}>Select Rating</Text>

      <Pressable
        style={styles.modalOption}
        onPress={() => {
          setSelectedRating(null);
          setShowRatingModal(false);
        }}
      >
        <Text style={styles.modalOptionText}>All Ratings</Text>
      </Pressable>

      {[3, 4, 5].map((rating) => (
        <Pressable
          key={rating}
          style={styles.modalOption}
          onPress={() => {
            setSelectedRating(rating);
            setShowRatingModal(false);
          }}
        >
          <Text style={styles.modalOptionText}>{rating} Stars</Text>
        </Pressable>
      ))}
    </Pressable>
  </Pressable>
</Modal>


        {/* Price Filter "Modal" */}
        {/* Price Filter Modal */}
<Modal
  visible={showPriceModal}
  transparent
  animationType="fade"
  onRequestClose={() => setShowPriceModal(false)}
>
  <Pressable
    style={styles.modalOverlay}
    onPress={() => setShowPriceModal(false)}
  >
    <Pressable
      style={styles.modalContent}
      onPress={() => {}}
    >
      <Text style={styles.modalTitle}>Select Price</Text>

      <Pressable
        style={styles.modalOption}
        onPress={() => {
          setSelectedPrice(null);
          setShowPriceModal(false);
        }}
      >
        <Text style={styles.modalOptionText}>All Prices</Text>
      </Pressable>

      {[1, 2, 3].map((price) => (
        <Pressable
          key={price}
          style={styles.modalOption}
          onPress={() => {
            setSelectedPrice(price);
            setShowPriceModal(false);
          }}
        >
          <Text style={styles.modalOptionText}>
            {getPriceString(price)}
          </Text>
        </Pressable>
      ))}
    </Pressable>
  </Pressable>
</Modal>


        {/* Bottom nav */}
        <View style={styles.bottomNav}>
          <Pressable style={styles.navItem}>
            <View style={[styles.navIcon, styles.navIconActive]}>
              <Text style={styles.navIconText}>🍔</Text>
            </View>
            <Text style={styles.navLabel}>Restaurants</Text>
          </Pressable>
          <Pressable
            style={styles.navItem}
            onPress={() => navigation.navigate('OrderHistory')}
          >
            <View style={styles.navIcon}>
              <Text style={styles.navIconText}>🕐</Text>
            </View>
            <Text style={styles.navLabel}>OrderHistory</Text>
          </Pressable>
          <Pressable
            style={styles.navItem}
            onPress={() => {
              navigation.navigate('CustomerAccount');
            }}
          >
            <View style={styles.navIcon}>
              <Text style={styles.navIconText}>👤</Text>
            </View>
            <Text style={styles.navLabel}>Account</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop:
      Platform.OS === 'android'
        ? (StatusBar.currentHeight || 0) + 12
        : 12,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  logo: {
    width: 150,
    height: 40,
  },
  logoutButton: {
    backgroundColor: '#DA583B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  logoutText: {
    color: '#FFFFFF',
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
    color: '#222126',
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
    color: '#222126',
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: '#DA583B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  dropdownArrow: {
    color: '#FFFFFF',
    fontSize: 10,
    marginLeft: 8,
  },
  restaurantsTitleSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
  },
  restaurantsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222126',
  },

  // NEW: content wrapper + FlatList style
  content: {
    flex: 1,
  },
  list: {
    flex: 1,
  },

  listContainer: {
    padding: 16,
    paddingBottom: 80, // keep content above bottom nav
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    // Native shadow (instead of boxShadow)
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
    backgroundColor: '#F0F0F0',
  },
  cardContent: {
    padding: 12,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222126',
    marginBottom: 4,
  },
  stars: {
    fontSize: 14,
    color: '#222126',
  },
  priceText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#DA583B',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#DA583B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222126',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666666',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
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
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  navIconActive: {
    backgroundColor: '#E0E0E0',
  },
  navIconText: {
    fontSize: 20,
  },
  navLabel: {
    fontSize: 12,
    color: '#666666',
  },
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContent: {
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  padding: 20,
  width: '80%',
  maxWidth: 300,
},
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222126',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#222126',
  },
});
