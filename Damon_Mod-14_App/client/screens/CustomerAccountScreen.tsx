import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  CustomerAccount: undefined;
  Restaurants: undefined;
  RestaurantMenu: { restaurant: any };
  OrderHistory: undefined;
};

/**
 * CustomerAccountScreen - Customer account management interface
 * Displays and allows updating of customer account information
 */
export default function CustomerAccountScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [primaryEmail, setPrimaryEmail] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  useEffect(() => {
    // Load customer data
    loadCustomerData();
  }, []);

  const loadCustomerData = async () => {
    try {
      setLoading(true);
      const customerId = (global as any).customerId;
      
      // TODO: Fetch customer data from API
      // For now, using placeholder data
      setPrimaryEmail('erica.ger@gmail.com');
      setCustomerEmail('miguelina_powlowski.edit@adams.org');
      setCustomerPhone('817-268-8862');
    } catch (error) {
      console.error('Error loading customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAccount = async () => {
    try {
      setLoading(true);
      // TODO: Implement account update API call
      console.log('Updating account:', { customerEmail, customerPhone });
      alert('Account updated successfully!');
    } catch (error) {
      console.error('Error updating account:', error);
      alert('Failed to update account');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    (global as any).customerId = null;
    (global as any).accountType = null;
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('../assets/Images/AppLogoV2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>LOG OUT</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>MY ACCOUNT</Text>
          
          <Text style={styles.accountType}>Logged In As: Customer</Text>

          <View style={styles.formSection}>
            <Text style={styles.label}>Primary Email (Read Only)</Text>
            <TextInput
              style={[styles.input, styles.inputReadOnly]}
              value={primaryEmail}
              editable={false}
            />
            <Text style={styles.helperText}>Email used to login to the application.</Text>

            <Text style={styles.label}>Customer Email:</Text>
            <TextInput
              style={styles.input}
              value={customerEmail}
              onChangeText={setCustomerEmail}
              placeholder="Enter customer email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.helperText}>Email used for your Customer account.</Text>

            <Text style={styles.label}>Customer Phone:</Text>
            <TextInput
              style={styles.input}
              value={customerPhone}
              onChangeText={setCustomerPhone}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
            <Text style={styles.helperText}>Phone number for your Customer account.</Text>

            <TouchableOpacity 
              style={styles.updateButton}
              onPress={handleUpdateAccount}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.updateButtonText}>UPDATE ACCOUNT</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

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
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIcon, styles.navIconActive]}>
            <Text style={styles.navIconText}>👤</Text>
          </View>
          <Text style={styles.navLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222126',
    marginBottom: 16,
  },
  accountType: {
    fontSize: 16,
    color: '#222126',
    marginBottom: 24,
  },
  formSection: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222126',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#222126',
  },
  inputReadOnly: {
    backgroundColor: '#F5F5F5',
    color: '#666666',
  },
  helperText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    marginBottom: 8,
  },
  updateButton: {
    backgroundColor: '#DA583B',
    borderRadius: 6,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
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
});
