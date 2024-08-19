import React, { useState } from 'react';
import axios from 'axios';
import { ScrollView, Text, StyleSheet, TextInput, TouchableOpacity, Alert, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';  
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = () => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in both username and password');
      return;
    }

    try {
      const response = await axios.post('https://digitaldopamine.in/wp-json/custom/v1/login', {
        username: username.trim(),
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data && response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
        Alert.alert('Success', 'Login successful!');
        router.push('/home'); // Navigate to the home screen
      } else {
        throw new Error('Login failed. Invalid credentials.');
      }

    } catch (error) {
      if (error.response?.data?.code === 'invalid_credentials') {
        Alert.alert('Error', 'Invalid username or password. Please try again.');
      } else {
        Alert.alert('Error', error.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      // Clear the input fields
      setUsername('');
      setPassword('');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.description}>
        Please enter your username and password to continue.
      </Text>

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={24} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          onChangeText={setUsername}
          value={username}
          placeholder="Username"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry={true}
        />
      </View>
        
      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text style={styles.btnText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.text}>Don't have an account?</Text>
      <Link href="/signup">
        <Text style={styles.signupText}>Sign Up</Text>
      </Link>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  title: {
    color: '#333',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    width: '100%',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
    paddingRight: 10,
  },
  btn: {
    backgroundColor: '#1E90FF',
    width: '100%',
    height: 50,         
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 10,    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  btnText: {
    color: 'white',
    fontSize: 18,       
    fontWeight: 'bold',
  },
  text: {
    color: '#666',
    marginTop: 20, 
    textAlign: 'center',
    fontSize: 16,
  },
  signupText: {
    color: '#1E90FF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SignIn;
