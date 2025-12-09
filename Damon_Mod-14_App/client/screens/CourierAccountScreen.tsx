import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image, SafeAreaView, ActivityIndicator, ScrollView, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  CourierAccount: undefined;
  CourierDeliveries: undefined;
};

/**
 * CourierAccountScreen - Courier account management interface
 * Displays and allows updating of courier account information
 */
export default function CourierAccountScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [primaryEmail, setPrimaryEmail] = useState('');
  const [courierEmail, setCourierEmail] = useState('');
  const [courierPhone, setCourierPhone] = useState('');

  useEffect(() => {
    // Load courier data
    loadCourierData();
  }, []);

  const loadCourierData = async () => {
    try {
      setLoading(true);
      const courierId = (global as any).courierId;
      
      // TODO: Fetch courier data from API using /api/couriers/{courierId}
      // For now, using placeholder data
      setPrimaryEmail('erica.ger@gmail.com');
      setCourierEmail('erica.ger.courier@gmail.com');
      setCourierPhone('789-101-1234');
    } catch (error) {
      console.error('Error loading courier data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAccount = async () => {
    try {
      setLoading(true);
      // TODO: Implement courier account update API call
      console.log('Updating courier account:', { courierEmail, courierPhone });
      alert('Account updated successfully!');
    } catch (error) {
      console.error('Error updating account:', error);
      alert('Failed to update account');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    (global as any).courierId = null;
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
          <Pressable 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>LOG OUT</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>MY ACCOUNT</Text>
          
          <Text style={styles.accountType}>Logged In As: Courier</Text>

          <View style={styles.formSection}>
            <Text style={styles.label}>Primary Email (Read Only)</Text>
            <TextInput
              style={[styles.input, styles.inputReadOnly]}
              value={primaryEmail}
              editable={false}
            />
            <Text style={styles.helperText}>Email used to login to the application.</Text>

            <Text style={styles.label}>Courier Email:</Text>
            <TextInput
              style={styles.input}
              value={courierEmail}
              onChangeText={setCourierEmail}
              placeholder="Enter courier email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.helperText}>Email used for your Courier account.</Text>

            <Text style={styles.label}>Courier Phone:</Text>
            <TextInput
              style={styles.input}
              value={courierPhone}
              onChangeText={setCourierPhone}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
            <Text style={styles.helperText}>Phone number for your Courier account.</Text>

            <Pressable 
              style={styles.updateButton}
              onPress={handleUpdateAccount}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.updateButtonText}>UPDATE ACCOUNT</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Pressable 
          style={styles.navItem}
          onPress={() => navigation.navigate('CourierDeliveries')}
        >
          <View style={styles.navIcon}>
            <Text style={styles.navIconText}>🚗</Text>
          </View>
          <Text style={styles.navLabel}>Deliveries</Text>
        </Pressable>
        <Pressable style={styles.navItem}>
          <View style={[styles.navIcon, styles.navIconActive]}>
            <Text style={styles.navIconText}>👤</Text>
          </View>
          <Text style={styles.navLabel}>Account</Text>
        </Pressable>
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
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 12 : 32,
    paddingBottom: 16,
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
