import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // https://fontawesome.com/icons?d=gallery

export default function NavBar({ page, setPage }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setPage(0)} style={styles.navButton} activeOpacity={0.6} ><FontAwesome name='home' size={40} color={page === 0 ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.5)'} /></TouchableOpacity>
            <TouchableOpacity onPress={() => setPage(1)} style={styles.navButton} activeOpacity={0.6} ><FontAwesome name='user' size={40} color={page === 1 ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.5)'} /></TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:
    {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 10,
        borderTopColor: 'rgb(150, 150, 150)',
        borderTopWidth: 2,
    },

    navButton:
    {
        marginHorizontal: 30,
    },
});