import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // https://ionicons.com/v4/cheatsheet.html
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import firebase from 'firebase';
import { firestore } from '../FirebaseConfig';
import { useCollectionData } from 'react-firebase-hooks/firestore';

export default function NewPostModal({ user, setNewPostModal }) {
    const [newImage, setNewImage] = useState(null); // In base64 
    const [imageHeight, setImageHeight] = useState(0); // The height of the new image

    const postsRef = firestore.collection('posts');
    const [posts] = useCollectionData(postsRef, { idField: 'id' });

    useEffect(() => {
        // Ask for permission to access the media library
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to be able to select images!');
            }
        })();
    }, [])

    const pickImage = () => {
        ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            //allowsEditing: true,
            quality: 0.5,
            base64: true,
        }).then(response => {
            setNewImage(response.base64);

            setImageHeight(response.height);
        });
    };

    const post = () => {
        const url = `data:image/jpg;base64,${newImage}`;

        // Upload image to firebase storage
        fetch(url)
            .then(response => response.blob())
            .then((blob) => {
                const fileRef = firebase.storage().ref().child(`Image${posts.length}`);
                fileRef.put(blob).then(() => {
                    //console.log("Successfully uploaded file to firebase storage!");
                });

                setNewPostModal(false);
            })

        // Create 'post' document in firestore
        postsRef.add({
            index: posts.length,
            poster: user.id,
            likes: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
    }

    return (
        <View style={styles.backdrop}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.closeButton} onPress={() => setNewPostModal(false)} activeOpacity={0.6}>
                    <Ionicons style={styles.closeButtonIcon} name="md-close" size={28} color="white" />
                </TouchableOpacity>

                <Text style={styles.title}>Create New Post</Text>

                <TouchableOpacity style={styles.pickImageButton} onPress={pickImage} activeOpacity={0.6}>
                    <Text style={styles.pickImageButtonText}>Choose Image</Text>
                </TouchableOpacity>

                {newImage && <Image source={{ uri: `data:image/jpg;base64,${newImage}` }} style={styles.selectedImage} />}

                {newImage && <TouchableOpacity style={styles.postButton} onPress={post} activeOpacity={0.6}>
                    <LinearGradient style={styles.gradient} colors={['rgb(255, 35, 0)', 'rgb(255, 165, 0)']} start={[0, 0]} end={[1, 1]}>
                        <Text style={styles.postButtonText}>Post</Text>
                    </LinearGradient>
                </TouchableOpacity>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    backdrop:
    {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },

    container:
    {
        backgroundColor: 'rgb(10, 10, 10)',
        position: 'relative',
        padding: 20,
        borderColor: 'rgb(150, 150, 150)',
        borderWidth: 3,
        borderRadius: 20,
    },

    closeButton:
    {
        backgroundColor: 'rgb(10, 10, 10)',
        position: 'absolute',
        top: -15,
        right: -15,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        borderColor: 'rgb(150, 150, 150)',
        borderWidth: 3,
        borderRadius: 20,
    },

    title:
    {
        color: '#fff',
        fontSize: 30,
    },

    pickImageButton:
    {
        backgroundColor: '#000',
        marginTop: 10,
        paddingVertical: 5,
        borderColor: 'rgb(150, 150, 150)',
        borderWidth: 3,
        borderRadius: 20,
    },

    pickImageButtonText:
    {
        color: '#fff',
        fontSize: 25,
        textAlign: 'center',
    },

    postButton:
    {
        backgroundColor: '#000',
        marginTop: 20,
        borderRadius: 20,
    },

    gradient:
    {
        paddingVertical: 10,
        borderRadius: 20,
    },

    postButtonText:
    {
        color: '#fff',
        fontSize: 30,
        textAlign: 'center',
    },

    selectedImage:
    {
        width: 200,
        height: 200,
        marginTop: 15,
        borderRadius: 15,
    },
});