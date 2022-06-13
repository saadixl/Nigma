import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, child, get, set, push, update  } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBmavpgzEKbWBkNGLkk9NSRs8rA1gpiSjo",
    authDomain: "nigma-chat.firebaseapp.com",
    databaseURL: "https://nigma-chat-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "nigma-chat",
    storageBucket: "nigma-chat.appspot.com",
    messagingSenderId: "451101397721",
    appId: "1:451101397721:web:ee00467b64e45e155be4c8",
    measurementId: "G-GCVJFJMFYL"
};

// Initialize Firebase and Firestore
initializeApp(firebaseConfig);

export {
    getDatabase, ref, onValue, child, get, set, push, update 
}