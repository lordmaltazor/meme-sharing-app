import firebase from 'firebase';
import 'firebase/storage';

firebase.initializeApp({
    apiKey: "AIzaSyC0u0bMaWIwmCMx1mHXnvKxzXV6XDU3Ay4",
    authDomain: "meme-sharing-app.firebaseapp.com",
    projectId: "meme-sharing-app",
    storageBucket: "meme-sharing-app.appspot.com",
    messagingSenderId: "321861897970",
    appId: "1:321861897970:web:9aa5c6cde7778d85230a6b"
});

const firestore = firebase.firestore();

export { firestore }