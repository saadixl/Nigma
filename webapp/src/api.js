import { getDatabase, ref, child, get, onValue, push, update } from './firebase';
import {
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider,
    signOut,
    inMemoryPersistence,
    setPersistence,
} from "firebase/auth";

const auth = getAuth();

// Method to sign with google popup
async function signInWithPopupGoogle() {
    try {
        await setPersistence(auth, inMemoryPersistence);
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.log("Failed to login due to", error);
        return;
    }
}

// Method for logout
async function logOut() {
    await signOut(auth);
}

// Method to get conversation list
async function getConversations({ uid }) {
    const conversationsPath = `users/${uid}/conversations`;
    return new Promise((resolve, reject) => {
        onValue(ref(getDatabase(), conversationsPath), (snapshot) => {
            resolve(snapshot.val());
        });
    });
}

async function getConversation({ conversationId }) {
    const dbRef = ref(getDatabase());
    const conversationPath = `conversations/${conversationId}`;
    const snapshot = await get(child(dbRef, conversationPath));
    return snapshot.val();
}

async function sendMessage({ text, conversationId, uid }) {
    const dbRef = ref(getDatabase());
    const newMessageId = push(child(dbRef, `conversations/${conversationId}`)).key;
    const updates = {}, timestamp = Date.now();
    updates[`/conversations/${conversationId}/${newMessageId}`] = {
        text,
        friendId: uid,
        timestamp
    };
    updates[`/users/${uid}/conversations/${conversationId}/lastUpdatedAt`] = timestamp;
    return update(dbRef, updates);
}

function createNewConversation({friendId, friendName, profile}) {
    const {  displayName, uid } = profile;
    const dbRef = ref(getDatabase());
    const newConversationId = push(child(dbRef, `users/${uid}/conversations`)).key;
    const myConversationsPath = `/users/${uid}/conversations/${newConversationId}`;
    const friendsConversationsPath = `/users/${friendId}/conversations/${newConversationId}`;
    const updates = {}, lastUpdatedAt = Date.now();
    updates[friendsConversationsPath] = {
        friendId: uid,
        friendName: displayName,
        lastUpdatedAt
    };
    updates[myConversationsPath] = {
        friendId,
        friendName,
        lastUpdatedAt
    };
    return update(dbRef, updates);
}

export {
    logOut,
    signInWithPopupGoogle,
    getConversations,
    getConversation,
    sendMessage,
    createNewConversation
};



