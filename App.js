import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import firebase from 'firebase';
import { firestore } from './FirebaseConfig';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Header from './comps/Header';
import HomePage from './comps/HomePage/HomePage';
import ProfilePage from './comps/ProfilePage/ProfilePage';
import NavBar from './comps/NavBar';
import NewPostModal from './comps/NewPostModal';

export default function App() {
    const [newPostModal, setNewPostModal] = useState(false);
    const [loginModal, setLoginModal] = useState(false);

    const [page, setPage] = useState(0);
    // 0 = Home Page
    // 1 = Profile Page

    const [storageFiles, setStorageFiles] = useState([]);

    const postsRef = firestore.collection("posts").orderBy("createdAt", "desc").limit(100);
    const [posts] = useCollectionData(postsRef, { idField: 'id' });

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        // Get all files from firebase
        firebase.storage().ref().listAll().then(async (response) => {
            //console.log("Items: " + response.items.length);

            for (let i = 0; i < response.items.length; i++) {
                //console.log(element);

                // This gets executed in random order because we have to wait 
                // For a promise and the loop continues anyway
                const url = await response.items[i].getDownloadURL();

                setStorageFiles(storageFiles => [
                    ...storageFiles, url
                ]);
            };
        }).catch((error) => {
            console.error(error)
        })
    }, [])

    return (
        <View style={styles.container}>
            <Header user={user} setNewPostModal={setNewPostModal} />

            {page === 0 ? <HomePage firestore={firestore} user={user} storageFiles={storageFiles} posts={posts} /> : <ProfilePage firestore={firestore} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} setUser={setUser} username={username} setUsername={setUsername} password={password} setPassword={setPassword} posts={posts} storageFiles={storageFiles} loginModal={loginModal} setLoginModal={setLoginModal} />}

            <NavBar page={page} setPage={setPage} />

            {newPostModal && <NewPostModal user={user} setNewPostModal={setNewPostModal} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(10, 10, 10)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
