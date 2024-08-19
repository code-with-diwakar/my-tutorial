import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import HTMLView from 'react-native-htmlview';

const { width } = Dimensions.get('window'); // Get device width for responsive design

const Post = () => {
  const { post } = useLocalSearchParams();
  const postData = JSON.parse(post);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Hook for navigation

  useEffect(() => {
    const fetchFeaturedImage = async () => {
      if (postData.featured_media) {
        try {
          const response = await axios.get(`https://digitaldopamine.in/wp-json/wp/v2/media/${postData.featured_media}`);
          setFeaturedImage(response.data.source_url);
        } catch (error) {
          console.error('Error fetching featured image:', error);
        }
      }
      setLoading(false);
    };

    fetchFeaturedImage();
  }, [postData.featured_media]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={styles.loadingText}>Loading post...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{postData.title.rendered}</Text>

      {featuredImage && (
        <Image
          source={{ uri: featuredImage }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.contentContainer}>
        <HTMLView
          value={postData.content.rendered}
          stylesheet={htmlStyles}
        />
      </View>

      {/* Button to redirect to the Home screen */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/home')}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#1E90FF',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: width - 40, // Responsive width
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498DB',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20, // Additional space at the bottom
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const htmlStyles = StyleSheet.create({
  p: {
    fontSize: 18,
    color: '#34495E',
    marginBottom: 10,
    lineHeight: 24,
  },
  img: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1E90FF',
  },
  h2: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2980B9',
  },
  h3: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3498DB',
  },
});




export default Post;
