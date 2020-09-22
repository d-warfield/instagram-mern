import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAAtHU9vWk4yVzJTVZVaATzZwhNO00CKTs",
  authDomain: "firegram-2a6cc.firebaseapp.com",
  databaseURL: "https://firegram-2a6cc.firebaseio.com",
  projectId: "firegram-2a6cc",
  storageBucket: "firegram-2a6cc.appspot.com",
  messagingSenderId: "170579951425",
  appId: "1:170579951425:web:38d04eef3c38c5b4a92bc0",
  measurementId: "G-L116P6C9B4"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };