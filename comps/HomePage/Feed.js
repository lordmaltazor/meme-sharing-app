import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import Post from './Post';

export default function Feed({ firestore, user, storageFiles, posts }) {
    return (
        <View style={styles.container}>
            <ScrollView style={styles.posts} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                {posts && posts.map((post) => <Post key={post.id} firestore={firestore} user={user} file={storageFiles[post.index]} postDoc={post} />)}

                <View style={styles.lastPost}>
                    <Text style={styles.lastPostText}>You reached the bottom of the feed!</Text>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
    },

    posts:
    {
        flex: 1,
    },

    lastPost:
    {
        backgroundColor: 'rgb(50, 50, 50)',
        paddingVertical: 20,
        borderRadius: 10,
    },

    lastPostText:
    {
        color: '#fff',
        marginHorizontal: 10,
        fontSize: 25,
        textAlign: 'center',
    },
});