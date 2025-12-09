import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
  Modal,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { orderService } from '../services/apiService';

type RootStackParamList = {
  Login: undefined;
  CourierAccount: undefined;
  CourierDeliveries: undefined;
};

interface Delivery {
  id: number;
  address: string;
  status: string;
}

/**
 * CourierDeliveriesScreen - Displays courier's assigned deliveries
 * Status buttons are clickable and cycle through: PENDING → IN_PROGRESS → DELIVERED
 * Changes are reflected in the database
 */
export default function CourierDeliveriesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const loadDeliveries = async () => {
    const courierId = (global as any).courierId;
    
    if (!courierId) {
      setError('Not logged in as courier');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const orders = await orderService.getCustomerOrders(courierId); // Using same endpoint, backend returns courier orders when courier ID is provided
      
      const transformedDeliveries: Delivery[] = orders.map((order: any) => ({
        id: order.id,
        address: order.customer_address || order.address || 'Address not available',
        status: order.status,
      }));
      
      setDeliveries(transformedDeliveries);
    } catch (err) {
      console.error('Error loading deliveries:', err);
      setError('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadDeliveries();
    }, [])
  );

  const getNextStatus = (currentStatus: string): string => {
    switch (currentStatus) {
      case 'PENDING':
        return 'IN_PROGRESS';
      case 'IN_PROGRESS':
        return 'DELIVERED';
      case 'DELIVERED':
        return 'DELIVERED'; // Already delivered, no change
      default:
        return 'PENDING';
    }
  };

  const handleStatusClick = async (delivery: Delivery) => {
    const nextStatus = getNextStatus(delivery.status);
    
    // If already delivered, don't allow changes
    if (delivery.status === 'DELIVERED') {
      return;
    }

    try {
      setUpdatingOrderId(delivery.id);
      console.log(`Updating order ${delivery.id} status from ${delivery.status} to ${nextStatus}`);
      
      await orderService.updateStatus(delivery.id, nextStatus);
      
      // Update local state
      setDeliveries(prev =>
        prev.map(d =>
          d.id === delivery.id ? { ...d, status: nextStatus } : d
        )
      );
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update delivery status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING':
        return styles.statusPending;
      case 'IN_PROGRESS':
        return styles.statusInProgress;
      case 'DELIVERED':
        return styles.statusDelivered;
      default:
        return styles.statusPending;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'IN PROGRESS';
      default:
        return status;
    }
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
            <Text style={styles.title}>MY DELIVERIES</Text>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#DA583B" />
                <Text style={styles.loadingText}>Loading deliveries...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : deliveries.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No deliveries assigned</Text>
              </View>
            ) : (
              <View style={styles.tableContainer}>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.headerCell, styles.orderIdColumn]}>ORDER ID</Text>
                  <Text style={[styles.headerCell, styles.addressColumn]}>ADDRESS</Text>
                  <Text style={[styles.headerCell, styles.statusColumn]}>STATUS</Text>
                  <Text style={[styles.headerCell, styles.viewColumn]}>VIEW</Text>
                </View>

                {/* Table Rows */}
                {deliveries.map((delivery) => (
                  <View key={delivery.id} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.orderIdColumn]}>
                      {delivery.id}
                    </Text>
                    <Text style={[styles.tableCell, styles.addressColumn]}>
                      {delivery.address}
                    </Text>
                    <View style={styles.statusColumn}>
                      <Pressable
                        style={[styles.statusButton, getStatusStyle(delivery.status)]}
                        onPress={() => handleStatusClick(delivery)}
                        disabled={updatingOrderId === delivery.id || delivery.status === 'DELIVERED'}
                      >
                        {updatingOrderId === delivery.id ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                          <Text style={styles.statusButtonText}>
                            {getStatusText(delivery.status)}
                          </Text>
                        )}
                      </Pressable>
                    </View>
                    <View style={styles.viewColumn}>
                      <Pressable 
                        style={styles.viewButton}
                        onPress={() => {
                          setSelectedDelivery(delivery);
                          setShowDetailModal(true);
                        }}
                      >
                        <Text style={styles.viewIcon}>🔍</Text>
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
          <Pressable style={styles.navItem}>
            <View style={[styles.navIcon, styles.navIconActive]}>
              <Text style={styles.navIconText}>🚗</Text>
            </View>
            <Text style={styles.navLabel}>Deliveries</Text>
          </Pressable>
          <Pressable
            style={styles.navItem}
            onPress={() => navigation.navigate('CourierAccount')}
          >
            <View style={styles.navIcon}>
              <Text style={styles.navIconText}>👤</Text>
            </View>
            <Text style={styles.navLabel}>Account</Text>
          </Pressable>
        </View>

        {/* Delivery Detail Modal */}
        <Modal
          visible={showDetailModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDetailModal(false)}
        >
          <Pressable 
            style={styles.modalOverlay}
            onPress={() => setShowDetailModal(false)}
          >
            <View
              style={styles.modalContent}
              onStartShouldSetResponder={() => true}
              onResponderRelease={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Delivery Details</Text>
                <Pressable 
                  onPress={() => setShowDetailModal(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>X</Text>
                </Pressable>
              </View>

              {selectedDelivery && (
                <View style={styles.modalBody}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Order ID:</Text>
                    <Text style={styles.detailValue}>{selectedDelivery.id}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Delivery Address:</Text>
                    <Text style={styles.detailValue}>{selectedDelivery.address}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <View style={[styles.statusBadge, getStatusStyle(selectedDelivery.status)]}>
                      <Text style={styles.statusBadgeText}>
                        {getStatusText(selectedDelivery.status)}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              <Pressable
                style={styles.closeModalButton}
                onPress={() => setShowDetailModal(false)}
              >
                <Text style={styles.closeModalButtonText}>CLOSE</Text>
              </Pressable>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222126',
    marginBottom: 24,
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
  tableContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#222126',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  headerCell: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 14,
    color: '#222126',
    textAlign: 'center',
  },
  orderIdColumn: {
    flex: 1,
  },
  addressColumn: {
    flex: 2,
  },
  statusColumn: {
    flex: 2,
  },
  viewColumn: {
    flex: 1,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  statusPending: {
    backgroundColor: '#8B4513',
  },
  statusInProgress: {
    backgroundColor: '#DA583B',
  },
  statusDelivered: {
    backgroundColor: '#609475',
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
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
    backgroundColor: '#E8D5D1',
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
    maxWidth: 500,
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222126',
  },
  detailValue: {
    fontSize: 16,
    color: '#666666',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeModalButton: {
    backgroundColor: '#DA583B',
    marginHorizontal: 24,
    marginBottom: 24,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
