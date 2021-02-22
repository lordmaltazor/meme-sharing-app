import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // https://icons.expo.fyi/
import * as Animatable from 'react-native-animatable';
import firebase from 'firebase';

export default function Post({ firestore, user, file, postDoc }) {
    const [isLiked, setIsLiked] = useState(false);
    const [lastPress, setLastPress] = useState(0); // This is used for detecting a double tap on the image when liking

    const likeButton = useRef(null);

    const pressImage = () => {
        const delta = new Date().getTime() - lastPress;

        if (delta < 300 && isLiked === false) {
            setLiked(true);
        }

        setLastPress(new Date().getTime())
    }

    const setLiked = (boolean) => {
        if (user === null) {
            Alert.alert(
                "You have to be logged in to like posts!",
                'Click the profile icon at the bottom and then "Login" or "Create Account"',
                [
                    {
                        text: "OK",
                        style: "cancel"
                    },
                ],
                { cancelable: false }
            )

            return;
        }
        else if (postDoc.poster === user.id) {
            Alert.alert(
                "Error:",
                'You cannot like your own posts!',
                [
                    {
                        text: "OK",
                        style: "cancel"
                    },
                ],
                { cancelable: false }
            )

            return;
        }

        setIsLiked(boolean);

        // Like heart animation and updating the number of likes in firestore
        if (boolean) {
            likeButton.current.bounceIn(1000);

            // Incrementing the number of likes
            firestore.collection('posts').doc(postDoc.id).update({
                likes: firebase.firestore.FieldValue.increment(1)
            });
        }
        else {
            // Decrementing the number of likes
            firestore.collection('posts').doc(postDoc.id).update({
                likes: firebase.firestore.FieldValue.increment(-1)
            });
        }
    }

    return (
        <View style={styles.postContainer}>
            <TouchableOpacity onPress={pressImage} activeOpacity={1}><Image style={styles.image} source={{ uri: file }} /></TouchableOpacity>

            <View style={styles.info}>
                <Animatable.View ref={likeButton}><TouchableOpacity style={styles.likeButton} onPress={() => setLiked(!isLiked)} activeOpacity={0.6}><AntDesign name={isLiked ? 'heart' : 'hearto'} size={35} color={isLiked ? 'rgb(225, 0, 0)' : 'rgb(100, 100, 100)'} /></TouchableOpacity></Animatable.View>

                <Text style={styles.likes}>{postDoc.likes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} {postDoc.likes === 1 ? 'Like' : 'Likes'}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    postContainer:
    {
        borderRadius: 15,
        marginBottom: 20,
    },

    image:
    {
        width: '100%',
        height: Dimensions.get('window').width,
        resizeMode: 'contain',
        borderRadius: 10,
    },

    info:
    {
        flexDirection: 'row',
        alignItems: 'center',
        height: 75,
    },

    likeButton:
    {
        marginLeft: 15,
    },

    likes:
    {
        color: '#fff',
        marginLeft: 15,
        fontSize: 30,
    },
});