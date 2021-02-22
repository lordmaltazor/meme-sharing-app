import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import firebase from 'firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Ionicons } from '@expo/vector-icons'; // https://ionicons.com/v4/cheatsheet.html
import * as Animatable from 'react-native-animatable';

export default function LoginModal({ firestore, setUser, username, setUsername, password, setPassword, setIsLoggedIn, setLoginModal, loggingIn }) {
    const usernameTextInput = useRef(null);

    const textInput1 = useRef(null);
    const textInput2 = useRef(null);
    const textInput3 = useRef(null);

    const usersRef = firestore.collection("users");
    const [users] = useCollectionData(usersRef, { idField: 'id' });

    const [repeatedPassword, setRepeatedPassword] = useState('');

    useEffect(() => {
        usernameTextInput.current.focus();
    }, [])

    const getUser = (query) => {
        let foundUser = null;

        users.forEach(user => {
            if (user.username === query) {
                foundUser = user;
            }
        });

        return foundUser;
    }

    const submit = () => {
        let isValid = true;

        // Form validation
        if (loggingIn && getUser(username) === null) {
            alert(`Couldn't find a user with the name of "${username}"`);

            isValid = false;
        }
        else if (loggingIn && getUser(username).password !== password) {
            alert("Wrong password!");

            isValid = false;
        }
        else if (!loggingIn && getUser(username) !== null) {
            alert("That username is taken!");

            isValid = false;
        }
        else if (!loggingIn && repeatedPassword !== '' && repeatedPassword !== password) {
            alert("Your repeated password and password didn't match!");

            isValid = false;
        }

        if (username === '') {
            textInput1.current.shake(1000);

            isValid = false;
        }

        if (password === '') {
            textInput2.current.shake(1000);

            isValid = false;
        }

        if (!loggingIn && repeatedPassword === '') {
            textInput3.current.shake(1000);

            isValid = false;
        }

        // Add new user to database
        if (isValid) {
            if (loggingIn) {
                setUser(getUser(username));

                setIsLoggedIn(true);
            }
            else {
                usersRef.add({
                    username: username,
                    password: password,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                })
            }

            setLoginModal(false);
        }
    }

    return (
        <View style={styles.backdrop}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.closeButton} onPress={() => setLoginModal(false)} activeOpacity={0.6}>
                    <Ionicons style={styles.closeButtonIcon} name="md-close" size={28} color="white" />
                </TouchableOpacity>

                <Text style={styles.title}>{loggingIn ? 'Login' : 'Create account'}</Text>

                <Animatable.View ref={textInput1}><TextInput style={styles.textInput} onChangeText={(value) => setUsername(value)} placeholder='Username' placeholderTextColor='rgb(150, 150, 150)' ref={usernameTextInput} spellCheck={false} autoCorrect={false}></TextInput></Animatable.View>
                <Animatable.View ref={textInput2}><TextInput style={styles.textInput} onChangeText={(value) => setPassword(value)} placeholder='Password' placeholderTextColor='rgb(150, 150, 150)' spellCheck={false} autoCorrect={false}></TextInput></Animatable.View>
                {!loggingIn && <Animatable.View ref={textInput3}><TextInput style={styles.textInput} onChangeText={(value) => setRepeatedPassword(value)} placeholder='Repeat Password' placeholderTextColor='rgb(150, 150, 150)' spellCheck={false} autoCorrect={false}></TextInput></Animatable.View>}

                <TouchableOpacity style={styles.submitButton} onPress={submit} activeOpacity={0.6}>
                    <LinearGradient style={styles.gradient} colors={['rgb(255, 25, 0)', 'rgb(255, 165, 0)']} start={[0, 0]} end={[1, 1]}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </LinearGradient>
                </TouchableOpacity>
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
        alignItems: 'center',
    },

    container:
    {
        backgroundColor: 'rgb(10, 10, 10)',
        position: 'relative',
        marginTop: 20,
        paddingVertical: 15,
        paddingHorizontal: 20,
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
        textAlign: 'center',
    },

    textInput:
    {
        backgroundColor: '#000',
        color: '#fff',
        width: (Dimensions.get('window').width * 0.65),
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderColor: 'rgb(150, 150, 150)',
        borderWidth: 3,
        borderRadius: 500,
        fontSize: 20,
    },

    submitButton:
    {
        backgroundColor: '#000',
        marginTop: 15,
        borderRadius: 20,
    },

    gradient:
    {
        paddingVertical: 10,
        borderRadius: 20,
    },

    submitButtonText:
    {
        color: '#fff',
        fontSize: 25,
        textAlign: 'center',
    },
});