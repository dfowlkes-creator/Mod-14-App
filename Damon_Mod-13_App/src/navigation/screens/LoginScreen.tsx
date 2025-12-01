import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Details: undefined;
  Restaurants: undefined;
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Hardcoded credentials for demo
  const CORRECT_EMAIL = 'user@rocketfood.com';
  const CORRECT_PASSWORD = 'password123';

  const handleLogin = () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    if (email === CORRECT_EMAIL && password === CORRECT_PASSWORD) {
      setError('');
      navigation.navigate('Restaurants');
    } else {
      setError('Incorrect email or password. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/Images/AppLogoV2.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      <Text style={styles.title}>Sign In</Text>
      
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError('');
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError('');
          }}
          secureTextEntry
          placeholderTextColor="#999"
        />
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#333',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  error: {
    color: '#d32f2f',
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#ff6347',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
  },
  link: {
    color: '#007AFF',
    fontSize: 16,
  },
});
