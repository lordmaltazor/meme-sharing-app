import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import LoginModal from './LoginModal';
import Post from '../HomePage/Post';

export default function ProfilePage({ firestore, isLoggedIn, setIsLoggedIn, user, setUser, username, setUsername, password, setPassword, posts, storageFiles, loginModal, setLoginModal }) {
    const [loggingIn, setLoggingIn] = useState(false);

    const [ownPosts, setOwnPosts] = useState([]); // All posts by this user

    useEffect(() => {
        if (isLoggedIn) {
            getOwnPosts();
        }
    }, [user])

    const getOwnPosts = () => {
        setOwnPosts([]);

        // Looping over all the post docs
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].poster === user.id) {
                setOwnPosts(ownPosts => [
                    ...ownPosts, posts[i]
                ]);
            }
        }
    }

    return (
        <View style={styles.container}>
            {!isLoggedIn && <TouchableOpacity style={styles.button} onPress={() => {
                setLoginModal(true);
                setLoggingIn(true);
            }} onActive={0.6}><Text style={styles.buttonText}>Login</Text></TouchableOpacity>}

            {!isLoggedIn ? <TouchableOpacity style={styles.button} onPress={() => {
                setLoginModal(true);
                setLoggingIn(false);
            }} onActive={0.6}><Text style={styles.buttonText}>Create account</Text></TouchableOpacity> :
                // The user is logged in
                <View style={styles.container}>
                    <TouchableOpacity style={styles.signOutButton} onPress={() => {
                        Alert.alert(
                            "Warning",
                            `Are you sure that you want to sign out from "${username}"?`,
                            [
                                {
                                    text: 'Cancel',
                                    style: 'cancel',
                                },
                                {
                                    text: "Sign out",
                                    onPress: () => {
                                        setIsLoggedIn(false);
                                        setUser(null);

                                        setUsername('');
                                        setPassword('');
                                    }
                                },
                            ],
                            { cancelable: false }
                        );
                    }} onActive={0.6}><Text style={styles.signOutButtonText}>Sign out</Text></TouchableOpacity>

                    <Text style={styles.username}>{username}</Text>

                    <ScrollView style={styles.posts} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                        {ownPosts && ownPosts.map((post) => <Post key={post.id} firestore={firestore} user={user} file={storageFiles[post.index]} postDoc={post} />)}
                    </ScrollView>
                </View>
            }

            {loginModal && <LoginModal firestore={firestore} setUser={setUser} username={username} setUsername={setUsername} password={password} setPassword={setPassword} setIsLoggedIn={setIsLoggedIn} setLoginModal={setLoginModal} loggingIn={loggingIn} />}
        </View>
    )
}

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        width: '100%',
    },

    button:
    {
        backgroundColor: '#000',
        marginTop: 20,
        paddingVertical: 8,
        borderColor: 'rgb(150, 150, 150)',
        borderWidth: 3,
        borderRadius: 500,
    },

    buttonText:
    {
        color: '#fff',
        fontSize: 30,
        textAlign: 'center',
    },

    signOutButton:
    {
        backgroundColor: '#000',
        marginTop: 15,
        marginHorizontal: 10,
        paddingVertical: 8,
        borderColor: 'rgb(150, 150, 150)',
        borderWidth: 3,
        borderRadius: 500,
    },

    signOutButtonText:
    {
        color: '#fff',
        fontSize: 25,
        textAlign: 'center',
    },

    username:
    {
        color: '#fff',
        marginTop: 5,
        marginBottom: 10,
        marginLeft: 10,
        fontSize: 35,
    },

    posts:
    {
        flex: 1,
    },
});