import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Details: undefined;
  Restaurants: undefined;
  RestaurantMenu: { restaurant: any };
  OrderHistory: undefined;
};
import LoginScreen from './screens/LoginScreen';
import RestaurantsScreen from './screens/RestaurantsScreen';
import RestaurantMenuScreen from './screens/RestaurantMenuScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Restaurants" component={RestaurantsScreen} />
        <Stack.Screen name="RestaurantMenu" component={RestaurantMenuScreen} />
        <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

