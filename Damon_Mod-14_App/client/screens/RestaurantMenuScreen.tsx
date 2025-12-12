import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Modal,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { productService, orderService } from '../services/apiService';

type RootStackParamList = {
  Login: undefined;
  AccountTypeSelection: { customerId: number; courierId: number };
  CustomerAccount: undefined;
  CourierAccount: undefined;
  Restaurants: undefined;
  RestaurantMenu: { restaurant: any };
  OrderHistory: undefined;
};

interface MenuItem {
  id: number;
  name: string;
  cost: number;
  description?: string;
}

/**
 * RestaurantMenuScreen - Displays menu items with quantity controls
 * Quantities reset to 0 when component mounts (switching restaurants)
 * Order button disabled when no items selected
 */
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
  const [confirmByEmail, setConfirmByEmail] = useState(false);
  const [confirmByPhone, setConfirmByPhone] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const products = await productService.getByRestaurant(restaurant.id);
        setMenuItems(products);

        const initialQuantities: { [key: number]: number } = {};
        products.forEach((item) => {
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
    setQuantities((prev) => {
      const updated = {
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1,
      };
      console.log('incrementQuantity -> quantities:', updated);
      return updated;
    });
  };

  const decrementQuantity = (itemId: number) => {
    setQuantities((prev) => {
      const updated = {
        ...prev,
        [itemId]: Math.max(0, (prev[itemId] || 0) - 1),
      };
      console.log('decrementQuantity -> quantities:', updated);
      return updated;
    });
  };

  // Track total quantity based on current quantities
  const totalQuantity = useMemo(() => {
    const total = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
    console.log('totalQuantity:', total, 'quantities:', quantities);
    return total;
  }, [quantities]);

  const isCreateOrderDisabled = totalQuantity === 0;

  const getTotalPrice = () => {
    return menuItems.reduce((sum, item) => {
      return sum + (quantities[item.id] || 0) * item.cost;
    }, 0);
  };

  const handleCreateOrder = () => {
    if (isCreateOrderDisabled) return;
    setShowOrderModal(true);
    setOrderStatus(null);
  };

  const handleConfirmOrder = async () => {
    console.log('🔵 CONFIRM ORDER CLICKED - Starting order creation...');
    console.log('Checkbox states:', { confirmByEmail, confirmByPhone });
    
    setOrderStatus('processing');

    try {
      const customerId = (global as any).customerId || 1;
      const products = menuItems
        .filter((item) => quantities[item.id] > 0)
        .map((item) => ({
          id: item.id,
          quantity: quantities[item.id],
        }));

      const orderRequest = {
        customer_id: customerId,
        restaurant_id: restaurant.id,
        address_id: 1, // Using default address
        products,
        sendSMS: confirmByPhone,
        sendEmail: confirmByEmail,
      };

      console.log('📦 Creating order with full request:', orderRequest);
      console.log('✅ Notification preferences:', {
        sendSMS: confirmByPhone,
        sendEmail: confirmByEmail,
      });

      const response = await orderService.create(orderRequest);
      console.log('✅ Order created successfully:', response);

      setOrderStatus('success');
    } catch (err) {
      console.error('❌ Error creating order:', err);
      setOrderStatus('failure');
    }
  };

  const handleCloseModal = () => {
    const lastStatus = orderStatus;
    setShowOrderModal(false);
    setOrderStatus(null);
    if (lastStatus === 'success') {
      navigation.goBack();
    }
  };

  const getOrderedItems = () => {
    return menuItems.filter((item) => quantities[item.id] > 0);
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

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.headerSection}>
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <Text style={styles.priceIndicator}>
                  Price:{' '}
                  {restaurant.price_range
                    ? '$'.repeat(restaurant.price_range)
                    : 'N/A'}
                </Text>
                <Text style={styles.stars}>
                  Rating: {'★'.repeat(restaurant.rating)}
                </Text>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.createOrderButtonBase,
                  { backgroundColor: isCreateOrderDisabled ? '#CCCCCC' : '#DA583B' },
                  pressed && !isCreateOrderDisabled && { opacity: 0.8 },
                ]}
                onPress={isCreateOrderDisabled ? undefined : handleCreateOrder}
                disabled={isCreateOrderDisabled}
              >
                <Text
                  style={[
                    styles.createOrderButtonText,
                    isCreateOrderDisabled && styles.createOrderButtonTextDisabled,
                  ]}
                >
                  Create Order
                </Text>
              </Pressable>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#DA583B" />
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
                      <Text style={styles.menuItemPrice}>
                        ${item.cost.toFixed(2)}
                      </Text>
                      <Text style={styles.menuItemDescription}>
                        {item.description || 'Delicious menu item'}
                      </Text>
                    </View>

                    <View style={styles.quantityControls}>
                      <Pressable
                        style={styles.quantityButton}
                        onPress={() => decrementQuantity(item.id)}
                      >
                        <Text style={styles.quantityButtonText}>-</Text>
                      </Pressable>

                      <Text style={styles.quantityText}>
                        {quantities[item.id] || 0}
                      </Text>

                      <Pressable
                        style={styles.quantityButton}
                        onPress={() => incrementQuantity(item.id)}
                      >
                        <Text style={styles.quantityButtonText}>+</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <Pressable
            style={styles.navItem}
            onPress={() => navigation.navigate('Restaurants')}
          >
            <View style={styles.navIcon}>
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

        {/* Order Modal */}
        <Modal
          visible={showOrderModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCloseModal}
        >
          <Pressable style={styles.modalOverlay} onPress={handleCloseModal}>
            <View
              style={styles.modalContent}
              onStartShouldSetResponder={() => true}
              onResponderRelease={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Order Confirmation</Text>
                <Pressable onPress={handleCloseModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>X</Text>
                </Pressable>
              </View>

              <View style={styles.modalBody}>
                <Text style={styles.orderSummaryTitle}>Order Summary</Text>

                {getOrderedItems().map((item) => (
                  <View key={item.id} style={styles.orderItem}>
                    <Text style={styles.orderItemName}>{item.name}</Text>
                    <Text style={styles.orderItemQuantity}>
                      x{quantities[item.id]}
                    </Text>
                    <Text style={styles.orderItemPrice}>
                      ${' '}
                      {(item.cost * (quantities[item.id] || 0)).toFixed(2)}
                    </Text>
                  </View>
                ))}

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>TOTAL:</Text>
                  <Text style={styles.totalPrice}>
                    $ {getTotalPrice().toFixed(2)}
                  </Text>
                </View>

                {orderStatus === null && (
                  <View style={styles.confirmationPreferences}>
                    <Text style={styles.confirmationQuestion}>
                      Would you like to receive your order confirmation by email and/or text?
                    </Text>
                    
                    <View style={styles.checkboxContainer}>
                      <Pressable
                        style={styles.checkboxRow}
                        onPress={() => setConfirmByEmail(!confirmByEmail)}
                      >
                        <View style={[styles.checkbox, confirmByEmail && styles.checkboxChecked]}>
                          {confirmByEmail && <Text style={styles.checkboxCheck}>✓</Text>}
                        </View>
                        <Text style={styles.checkboxLabel}>By Email</Text>
                      </Pressable>

                      <Pressable
                        style={styles.checkboxRow}
                        onPress={() => setConfirmByPhone(!confirmByPhone)}
                      >
                        <View style={[styles.checkbox, confirmByPhone && styles.checkboxChecked]}>
                          {confirmByPhone && <Text style={styles.checkboxCheck}>✓</Text>}
                        </View>
                        <Text style={styles.checkboxLabel}>By Phone</Text>
                      </Pressable>
                    </View>
                  </View>
                )}

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
                    <Text style={styles.successText}>
                      Your order has been placed successfully.
                    </Text>
                  </View>
                )}

                {orderStatus === 'failure' && (
                  <View style={styles.statusContainer}>
                    <View style={styles.failureIcon}>
                      <Text style={styles.iconText}>✕</Text>
                    </View>
                    <Text style={styles.failureText}>
                      Your order could not be placed successfully. Please try
                      again.
                    </Text>
                  </View>
                )}
              </View>

              {orderStatus === null && (
                <Pressable
                  style={styles.confirmButton}
                  onPress={handleConfirmOrder}
                >
                  <Text style={styles.confirmButtonText}>CONFIRM ORDER</Text>
                </Pressable>
              )}

              {orderStatus === 'processing' && (
                <Pressable
                  style={[styles.confirmButton, styles.confirmButtonDisabled]}
                  disabled={true}
                >
                  <Text style={styles.confirmButtonText}>Processing Order...</Text>
                </Pressable>
              )}

              {orderStatus === 'failure' && (
                <Pressable
                  style={styles.confirmButton}
                  onPress={handleConfirmOrder}
                >
                  <Text style={styles.confirmButtonText}>CONFIRM ORDER</Text>
                </Pressable>
              )}
            </View>
          </Pressable>
        </Modal>
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
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 12 : 12,
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
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    padding: 20,
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
    color: '#222126',
    marginBottom: 4,
  },
  priceIndicator: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  stars: {
    fontSize: 14,
    color: '#666666',
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
    borderBottomColor: '#E0E0E0',
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
    color: '#222126',
    marginBottom: 4,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222126',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
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
    backgroundColor: '#222126',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222126',
    minWidth: 30,
    textAlign: 'center',
  },
  createOrderButtonBase: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 120,
  },
  createOrderButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  createOrderButtonTextDisabled: {
    color: '#888888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    ...Platform.select({
      web: {
        position: 'fixed' as any,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
      },
    }),
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    width: '100%',
    maxWidth: 400,
    ...Platform.select({
      web: {
        zIndex: 10000,
        position: 'relative' as any,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
      },
    }),
  },
  modalHeader: {
    backgroundColor: '#222126',
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
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  modalBody: {
    padding: 24,
  },
  orderSummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222126',
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
    color: '#222126',
    flex: 1,
  },
  orderItemQuantity: {
    fontSize: 14,
    color: '#666666',
    marginHorizontal: 12,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222126',
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
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222126',
    marginRight: 16,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222126',
  },
  confirmationPreferences: {
    marginTop: 24,
    paddingTop: 20,
  },
  confirmationQuestion: {
    fontSize: 14,
    color: '#222126',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#222126',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#FFFFFF',
    borderColor: '#222126',
  },
  checkboxCheck: {
    fontSize: 14,
    color: '#222126',
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#222126',
  },
  confirmButton: {
    backgroundColor: '#DA583B',
    marginHorizontal: 24,
    marginBottom: 24,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.7,
  },
  confirmButtonText: {
    color: '#FFFFFF',
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
    color: '#666666',
    fontStyle: 'italic',
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#609475',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  failureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DA583B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  successText: {
    fontSize: 14,
    color: '#609475',
    textAlign: 'center',
    fontWeight: '600',
  },
  failureText: {
    fontSize: 14,
    color: '#DA583B',
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
    color: '#666666',
  },
  errorContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#B51919',
    textAlign: 'center',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
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
  navIconText: {
    fontSize: 20,
  },
  navLabel: {
    fontSize: 12,
    color: '#666666',
  },
});
