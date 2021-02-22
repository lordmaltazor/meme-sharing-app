import React from 'react';
import { View, StyleSheet } from 'react-native';
import Feed from './Feed';

export default function HomePage({ firestore, user, storageFiles, posts }) {
    return (
        <View style={styles.container}>
            <Feed firestore={firestore} user={user} storageFiles={storageFiles} posts={posts} />
        </View>
    )
}

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        width: '100%',
    },
});