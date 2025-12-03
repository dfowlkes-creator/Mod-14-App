import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { productService, orderService } from '../services/apiService';

type RootStackParamList = {
  Login: undefined;
  Restaurants: undefined;
  RestaurantMenu: { restaurant: any };
  OrderHistory: undefined;
};

interface MenuItem {
  id: number;
  name: string;
  cost: number;
}

export default function RestaurantMenuScreen() {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { restaurant } = route.params as any;
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'processing' | 'success' | 'failure' | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const products = await productService.getByRestaurant(restaurant.id);
        setMenuItems(products);
        
        const initialQuantities: { [key: number]: number } = {};
        products.forEach(item => {
          initialQuantities[item.id] = 0;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        console.error('Error loading menu:', err);
        setError('Failed to load menu');
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [restaurant.id]);

  const incrementQuantity = (itemId: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const decrementQuantity = (itemId: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) - 1),
    }));
  };

  const getTotalQuantity = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    return menuItems.reduce((sum, item) => {
      return sum + (quantities[item.id] || 0) * item.cost;
    }, 0);
  };

  const isCreateOrderDisabled = getTotalQuantity() === 0;

  const handleCreateOrder = () => {
    if (!isCreateOrderDisabled) {
      setShowOrderModal(true);
      setOrderStatus(null);
    }
  };

  const handleConfirmOrder = async () => {
    setOrderStatus('processing');
    
    try {
      const customerId = (global as any).customerId || 1;
      const products = menuItems
        .filter(item => quantities[item.id] > 0)
        .map(item => ({
          id: item.id,
          quantity: quantities[item.id],
        }));
      
      await orderService.create({
        customer_id: customerId,
        restaurant_id: restaurant.id,
        address_id: 1, // Using default address
        products,
      });
      
      setOrderStatus('success');
    } catch (err) {
      console.error('Error creating order:', err);
      setOrderStatus('failure');
    }
  };

  const handleCloseModal = () => {
    setShowOrderModal(false);
    setOrderStatus(null);
    if (orderStatus === 'success') {
      navigation.goBack();
    }
  };

  const getOrderedItems = () => {
    return menuItems.filter(item => quantities[item.id] > 0);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/Images/AppLogoV1.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.logoutText}>LOG OUT</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.pageTitle}>RESTAURANT MENU</Text>
          
          <View style={styles.headerSection}>
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Text style={styles.priceIndicator}>Price: {restaurant.price_range ? '$'.repeat(restaurant.price_range) : 'N/A'}</Text>
              <Text style={styles.stars}>Rating: {('★').repeat(restaurant.rating)}</Text>
            </View>
            <TouchableOpacity 
              style={[
                styles.createOrderButton,
                isCreateOrderDisabled && styles.createOrderButtonDisabled
              ]}
              onPress={handleCreateOrder}
              disabled={isCreateOrderDisabled}
            >
              <Text style={[
                styles.createOrderButtonText,
                isCreateOrderDisabled && styles.createOrderButtonTextDisabled
              ]}>
                Create Order
              </Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#d9534f" />
              <Text style={styles.loadingText}>Loading menu...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : menuItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No menu items available</Text>
            </View>
          ) : (
            <View style={styles.menuSection}>
              {menuItems.map((item) => (
                <View key={item.id} style={styles.menuItem}>
                  <Image 
                    source={require('../assets/Images/RestaurantMenu.jpg')}
                    style={styles.menuItemImage}
                  />
                  <View style={styles.menuItemInfo}>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <Text style={styles.menuItemPrice}>${item.cost.toFixed(2)}</Text>
                  </View>
                  
                  <View style={styles.quantityControls}>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => decrementQuantity(item.id)}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    
                    <Text style={styles.quantityText}>{quantities[item.id] || 0}</Text>
                    
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => incrementQuantity(item.id)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Restaurants')}
        >
          <View style={styles.navIcon}>
            <Text style={styles.navIconText}>🍔</Text>
          </View>
          <Text style={styles.navLabel}>Restaurants</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('OrderHistory')}
        >
          <View style={styles.navIcon}>
            <Text style={styles.navIconText}>🕐</Text>
          </View>
          <Text style={styles.navLabel}>OrderHistory</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showOrderModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Confirmation</Text>
              <TouchableOpacity 
                onPress={handleCloseModal}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.orderSummaryTitle}>Order Summary</Text>
              
              {getOrderedItems().map((item) => (
                <View key={item.id} style={styles.orderItem}>
                  <Text style={styles.orderItemName}>{item.name}</Text>
                  <Text style={styles.orderItemQuantity}>x{quantities[item.id]}</Text>
                  <Text style={styles.orderItemPrice}>$ {(item.cost * quantities[item.id]).toFixed(2)}</Text>
                </View>
              ))}
              
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>TOTAL:</Text>
                <Text style={styles.totalPrice}>$ {getTotalPrice().toFixed(2)}</Text>
              </View>

              {orderStatus === 'processing' && (
                <View style={styles.statusContainer}>
                  <Text style={styles.processingText}>Processing Order...</Text>
                </View>
              )}

              {orderStatus === 'success' && (
                <View style={styles.statusContainer}>
                  <View style={styles.successIcon}>
                    <Text style={styles.iconText}>✓</Text>
                  </View>
                  <Text style={styles.successText}>Your order has been placed successfully.</Text>
                </View>
              )}

              {orderStatus === 'failure' && (
                <View style={styles.statusContainer}>
                  <View style={styles.failureIcon}>
                    <Text style={styles.iconText}>✕</Text>
                  </View>
                  <Text style={styles.failureText}>Your order could not be placed successfully. Please try again.</Text>
                </View>
              )}
            </View>
            
            {orderStatus === null && (
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleConfirmOrder}
              >
                <Text style={styles.confirmButtonText}>CONFIRM ORDER</Text>
              </TouchableOpacity>
            )}

            {orderStatus === 'processing' && (
              <TouchableOpacity 
                style={[styles.confirmButton, styles.confirmButtonDisabled]}
                disabled={true}
              >
                <Text style={styles.confirmButtonText}>Processing Order...</Text>
              </TouchableOpacity>
            )}

            {orderStatus === 'failure' && (
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleConfirmOrder}
              >
                <Text style={styles.confirmButtonText}>CONFIRM ORDER</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
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
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    padding: 20,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  restaurantInfo: {
    flex: 1,
    marginRight: 16,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  priceIndicator: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  stars: {
    fontSize: 14,
    color: '#666',
  },
  menuSection: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  menuItemInfo: {
    flex: 1,
    marginRight: 16,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d9534f',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#d9534f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    minWidth: 30,
    textAlign: 'center',
  },
  createOrderButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 120,
  },
  createOrderButtonDisabled: {
    backgroundColor: '#ccc',
  },
  createOrderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  createOrderButtonTextDisabled: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    backgroundColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '300',
  },
  modalBody: {
    padding: 24,
  },
  orderSummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  orderItemName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  orderItemQuantity: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 12,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    minWidth: 60,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 16,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#d9534f',
    marginHorizontal: 24,
    marginBottom: 24,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 16,
  },
  processingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5cb85c',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  failureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#d9534f',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  successText: {
    fontSize: 14,
    color: '#5cb85c',
    textAlign: 'center',
    fontWeight: '600',
  },
  failureText: {
    fontSize: 14,
    color: '#d9534f',
    textAlign: 'center',
    fontWeight: '600',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#d9534f',
    textAlign: 'center',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
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
