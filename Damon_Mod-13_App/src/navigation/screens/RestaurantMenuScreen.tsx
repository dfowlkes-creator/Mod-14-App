import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

const menuItems: MenuItem[] = [
  { id: '1', name: 'Caesar Salad', description: 'Fresh romaine lettuce with parmesan', price: 8.99 },
  { id: '2', name: 'Grilled Chicken', description: 'Tender grilled chicken breast', price: 14.99 },
  { id: '3', name: 'Pasta Carbonara', description: 'Classic Italian pasta dish', price: 12.99 },
  { id: '4', name: 'Margherita Pizza', description: 'Fresh mozzarella and basil', price: 11.99 },
  { id: '5', name: 'Fish and Chips', description: 'Beer-battered fish with fries', price: 13.99 },
  { id: '6', name: 'Veggie Burger', description: 'Plant-based burger with fixings', price: 10.99 },
];

export default function RestaurantMenuScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { restaurant } = route.params as any;
  
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    const initialQuantities: { [key: string]: number } = {};
    menuItems.forEach(item => {
      initialQuantities[item.id] = 0;
    });
    setQuantities(initialQuantities);
  }, [restaurant.id]);

  const incrementQuantity = (itemId: string) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const decrementQuantity = (itemId: string) => {
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
      return sum + (quantities[item.id] || 0) * item.price;
    }, 0);
  };

  const isCreateOrderDisabled = getTotalQuantity() === 0;

  const handleCreateOrder = () => {
    if (!isCreateOrderDisabled) {
      setShowOrderModal(true);
    }
  };

  const getOrderedItems = () => {
    return menuItems.filter(item => quantities[item.id] > 0);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.pageTitle}>RESTAURANT MENU</Text>
          
          <View style={styles.headerSection}>
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Text style={styles.priceIndicator}>Price: {restaurant.price}</Text>
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
          
          <View style={styles.menuSection}>
            {menuItems.map((item) => (
              <View key={item.id} style={styles.menuItem}>
                <Image 
                  source={require('../../../assets/Images/RestaurantMenu.jpg')}
                  style={styles.menuItemImage}
                />
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemDescription}>{item.description}</Text>
                  <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
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
        </View>
      </ScrollView>

      <Modal
        visible={showOrderModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOrderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Confirmation</Text>
              <TouchableOpacity 
                onPress={() => setShowOrderModal(false)}
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
                  <Text style={styles.orderItemPrice}>$ {(item.price * quantities[item.id]).toFixed(2)}</Text>
                </View>
              ))}
              
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>TOTAL:</Text>
                <Text style={styles.totalPrice}>$ {getTotalPrice().toFixed(2)}</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={() => {
                setShowOrderModal(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.confirmButtonText}>CONFIRM ORDER</Text>
            </TouchableOpacity>
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
  scrollContent: {
    paddingBottom: 20,
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
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
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
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
