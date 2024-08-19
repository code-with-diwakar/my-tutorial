import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
    const [posts, setPosts] = useState([]);  // Initialize posts as an empty array
    const [loading, setLoading] = useState(false);
    const [loadingPost, setLoadingPost] = useState(null); // Track which post is being loaded
    const router = useRouter();

    // Fetch posts from the API
    const fetchPosts = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                return;
            }

            const url = 'https://digitaldopamine.in/wp-json/wp/v2/posts/';
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (Array.isArray(response.data)) {
                // Fetch the featured image URLs
                const postsWithImages = await Promise.all(
                    response.data.map(async (post) => {
                        if (post.featured_media) {
                            try {
                                const imageResponse = await axios.get(
                                    `https://digitaldopamine.in/wp-json/wp/v2/media/${post.featured_media}`
                                );
                                return { ...post, featuredImageUrl: imageResponse.data.source_url };
                            } catch (imageError) {
                                console.error('Error fetching image:', imageError);
                                return { ...post, featuredImageUrl: null };
                            }
                        }
                        return { ...post, featuredImageUrl: null };
                    })
                );
                setPosts(postsWithImages);
            } else {
                console.log('Unexpected response format:', response.data);
                setPosts([]);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch posts on component mount
    useEffect(() => {
        fetchPosts();
    }, []);

    // Handle post click
    const viewPost = async (postId) => {
        try {
            setLoadingPost(postId); // Start loading for the clicked post
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                return;
            }

            const postResponse = await axios.get(`https://digitaldopamine.in/wp-json/wp/v2/posts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            router.push({
                pathname: '/post',
                params: { post: JSON.stringify(postResponse.data) },
            });
        } catch (error) {
            console.error('Error fetching post:', error);
        } finally {
            setLoadingPost(null); // Stop loading for the clicked post
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.staticContent}>
                <Text style={styles.title}>Welcome to Digital Dopamine</Text>
                <Text style={styles.subtitle}>Explore our latest blog posts below.</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View style={styles.postsContainer}>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <View key={post.id} style={styles.post}>
                                {post.featuredImageUrl ? (
                                    <Image
                                        source={{ uri: post.featuredImageUrl }}
                                        style={styles.postImage}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={styles.placeholderImage} />
                                )}
                                <View style={styles.postContent}>
                                    <Text style={styles.postTitle}>{post.title.rendered}</Text>
                                    <Text style={styles.postExcerpt}>{post.excerpt.rendered.replace(/<[^>]+>/g, '')}</Text>
                                    <TouchableOpacity
                                        style={styles.readMoreButton}
                                        onPress={() => viewPost(post.id)}
                                        disabled={loadingPost === post.id} // Disable while loading
                                    >
                                        {loadingPost === post.id ? (
                                            <ActivityIndicator size="small" color="#ffffff" />
                                        ) : (
                                            <Text style={styles.readMoreText}>Read More</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noPostsText}>No posts available.</Text>
                    )}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    staticContent: {
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    postsContainer: {
        width: '100%',
    },
    post: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        padding: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    placeholderImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: '#ccc',
    },
    postContent: {
        alignItems: 'flex-start',
    },
    postTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    postExcerpt: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    readMoreButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: '#3498DB',
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    readMoreText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    noPostsText: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default Home;
