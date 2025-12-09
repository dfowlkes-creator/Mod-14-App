import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

type RootStackParamList = {
  Login: undefined;
  AccountTypeSelection: {
    customerId?: number;
    courierId?: number;
  };
  CustomerAccount: undefined;
  CourierAccount: undefined;
  Restaurants: undefined;
};

type AccountTypeSelectionRouteProp = RouteProp<
  RootStackParamList,
  'AccountTypeSelection'
>;

/**
 * AccountTypeSelectionScreen - Allows users with both Customer and Courier accounts
 * to select which account type they want to use for this session
 */
export default function AccountTypeSelectionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<AccountTypeSelectionRouteProp>();

  const { customerId, courierId } = route.params || {};

  const handleCustomerSelect = () => {
    if (customerId) {
      (global as any).customerId = customerId;
      (global as any).accountType = 'customer';
      navigation.navigate('CustomerAccount');
    }
  };

  const handleCourierSelect = () => {
    if (courierId) {
      (global as any).courierId = courierId;
      (global as any).accountType = 'courier';
      navigation.navigate('CourierAccount');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/Images/AppLogoV2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Select Account Type</Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {/* Customer card */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleCustomerSelect}
            activeOpacity={0.7}
          >
            <MaterialIcons name="person" size={60} color="#C67C69" />
            <Text style={styles.optionText}>Customer</Text>
          </TouchableOpacity>

          {/* Courier card */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleCourierSelect}
            activeOpacity={0.7}
          >
            <FontAwesome5 name="taxi" size={60} color="#000000" />
            <Text style={styles.optionText}>Courier</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 320,
    height: 150,
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 30,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '75%',
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    marginTop: 12,
  },
});
