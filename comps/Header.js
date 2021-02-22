import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // IonIcons Cheatsheet: https://ionicons.com/v4/cheatsheet.html

export default function Header({ user, setNewPostModal }) {
    const createNewPost = () => {
        if (user === null) {
            Alert.alert(
                "You have to be logged in to post!",
                'Click the profile icon at the bottom and then "Login" or "Create Account"',
                [
                    {
                        text: "OK",
                        style: "cancel"
                    },
                ],
                { cancelable: false }
            )
        }
        else {
            setNewPostModal(true);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>App Name</Text>

            <TouchableOpacity onPress={createNewPost} activeOpacity={0.6}>
                <Ionicons style={styles.newPostButton} name="md-add-circle-outline" size={40} color="white" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingTop: 20,
        paddingBottom: 15,
        borderBottomColor: 'rgb(150, 150, 150)',
        borderBottomWidth: 2,
    },

    title:
    {
        color: '#fff',
        marginLeft: 10,
        fontSize: 35,
    },

    newPostButton:
    {
        marginRight: 10,
    },
});