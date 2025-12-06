import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView, FlatList, ActivityIndicator, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { orderService } from '../services/apiService';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Details: undefined;
  Restaurants: undefined;
  RestaurantMenu: { restaurant: any };
  OrderHistory: undefined;
};

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  restaurantName: string;
  status: string;
  orderDate: string;
  courrier: string;
  items: OrderItem[];
}

export default function OrderHistoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const loadOrders = async () => {
    if (!global.customerId) {
      setError('Not logged in');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const orderHistory = await orderService.getCustomerOrders(global.customerId);
      
      const transformedOrders: Order[] = orderHistory.map(order => ({
        id: order.id.toString(),
        restaurantName: order.restaurant_name,
        status: order.status,
        orderDate: new Date(order.timestamp).toISOString().split('T')[0],
        courrier: order.courier_name || 'Not assigned',
        items: order.products.map(p => ({
          name: p.product_name,
          quantity: p.quantity,
          price: p.unit_cost,
        })),
      }));
      
      // Sort by order ID descending (most recent first)
      transformedOrders.sort((a, b) => parseInt(b.id) - parseInt(a.id));
      
      setOrders(transformedOrders);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadOrders();
    }, [])
  );

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const renderOrderRow = ({ item }: { item: Order }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.restaurantName}</Text>
      <Text style={styles.tableCell}>{item.status}</Text>
      <TouchableOpacity 
        style={styles.viewButton}
        onPress={() => handleViewOrder(item)}
      >
        <Text style={styles.viewIcon}>🔍</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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

      <View style={styles.content}>
        <Text style={styles.pageTitle}>MY ORDERS</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#DA583B" />
            <Text style={styles.loadingText}>Loading orders...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadOrders}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubtext}>Your order history will appear here</Text>
          </View>
        ) : (
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>ORDER</Text>
              <Text style={styles.tableHeaderText}>STATUS</Text>
              <Text style={styles.tableHeaderText}>VIEW</Text>
            </View>

            <FlatList
              data={orders}
              keyExtractor={item => item.id}
              renderItem={renderOrderRow}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.tableBody}
            />
          </View>
        )}
      </View>

      {/* Order Detail Modal */}
      <Modal
        visible={showDetailModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderContent}>
                <Text style={styles.modalTitle}>{selectedOrder?.restaurantName}</Text>
                <Text style={styles.orderInfoText}>Order Date: {selectedOrder?.orderDate}</Text>
                <Text style={styles.orderInfoText}>Status: {selectedOrder?.status}</Text>
                <Text style={styles.orderInfoText}>Courrier: {selectedOrder?.courrier}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setShowDetailModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.itemsContainer}>
                {selectedOrder?.items.map((item, index) => (
                  <View key={index} style={styles.orderItem}>
                    <Text style={styles.orderItemName}>{item.name}</Text>
                    <Text style={styles.orderItemQuantity}>x{item.quantity}</Text>
                    <Text style={styles.orderItemPrice}>$ {item.price.toFixed(2)}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>TOTAL:</Text>
                <Text style={styles.totalPrice}>
                  $ {selectedOrder ? calculateTotal(selectedOrder.items).toFixed(2) : '0.00'}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

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
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIcon, styles.navIconActive]}>
            <Text style={styles.navIconText}>🕐</Text>
          </View>
          <Text style={styles.navLabel}>OrderHistory</Text>
        </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 16,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222126',
    marginBottom: 20,
  },
  tableContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#222126',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tableHeaderText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableBody: {
    paddingBottom: 80,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#222126',
    textAlign: 'center',
  },
  viewButton: {
    flex: 1,
    alignItems: 'center',
  },
  viewIcon: {
    fontSize: 18,
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    backgroundColor: '#222126',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  modalHeaderContent: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DA583B',
    marginBottom: 12,
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
  orderInfoText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  itemsContainer: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  errorText: {
    fontSize: 16,
    color: '#DA583B',
    marginBottom: 16,
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
});
