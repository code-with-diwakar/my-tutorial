import React, { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Image, StyleSheet, ImageBackground, StatusBar, Animated, TouchableOpacity } from 'react-native';

const App = () => {
  const router = useRouter();
  const logoAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(logoAnimation, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const scale = logoAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <ImageBackground
        source={require('../assets/images/background.jpg')}
        resizeMode="cover"
        style={styles.imageBackground}
      />

      <View style={styles.overlay} />

      <Animated.Image
        style={[styles.logo, { transform: [{ scale }] }]}
        source={require('../assets/images/image.png')}
      />

      <Text style={styles.text}>Welcome to Diwaker App</Text>

      <Text style={styles.text1}>
        Where Creativity Meets Innovation: Embark on a Journey of Limitless Exploration with Aora
      </Text>

      <TouchableOpacity style={styles.buttonContainer} activeOpacity={0.8} onPress={() => router.push('/signin')}>
        <Text style={styles.buttonText}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
  },
  imageBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -2,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: -1,
  },
  logo: {
    width: 300,
    height: 190,
    marginTop: 50,
    alignSelf: 'center',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#ffffff',
    padding: 1,
    backgroundColor: '#ffffff',
  },
  text: {
    color: '#ffffff',
    fontSize: 56,
    marginTop: 130,
    alignSelf: 'center',
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  text1: {
    color: '#cccccc',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 24,
    fontWeight: '300',
  },
  buttonContainer: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#FF6347',
    borderRadius: 30,
    marginTop: 40,
    alignSelf: 'center',
    shadowColor: '#FF4500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;
