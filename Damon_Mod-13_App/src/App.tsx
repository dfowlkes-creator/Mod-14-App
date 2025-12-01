import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Details: undefined;
  Restaurants: undefined;
  RestaurantMenu: { restaurant: any };
};
import LoginScreen from './navigation/screens/LoginScreen';
import RestaurantsScreen from './navigation/screens/RestaurantsScreen';
import RestaurantMenuScreen from './navigation/screens/RestaurantMenuScreen';

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';


function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Details')}>
        Go to Details
      </Button>
    </View>
  );
}

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerStyle: { backgroundColor: 'tomato' } }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Overview' }} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Restaurants" component={RestaurantsScreen} options={{ title: 'Restaurants' }} />
        <Stack.Screen name="RestaurantMenu" component={RestaurantMenuScreen} options={{ title: 'Menu' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

