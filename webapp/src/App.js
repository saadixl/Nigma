import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import { getDatabase, ref, child, get, onValue, push, update } from './firebase';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './components/Header';
import Conversations from './components/Conversations';
import Chatbox from './components/Chatbox';
import MessageWriter from './components/MessageWriter';

import { signInWithPopupGoogle, logOut, getConversations } from './api';

// const dbRef = ref(getDatabase());


// function handleCreateNewConversation(createNewConversation, uid) {
//   const friendId = window.prompt('Enter contact id here:');
//   const friendName = window.prompt('Enter contact\'s name here:');
//   createNewConversation({ friendId, friendName, uid });
// }

// function createNewConversation({friendId, friendName, myUid}) {
//   const dbRef = ref(getDatabase());
//   const newConversationId = push(child(dbRef, `users/${myUid}/conversations`)).key;
//   const myConversationsPath = `/users/${myUid}/conversations/${newConversationId}`;
//   const friendsConversationsPath = `/users/${friendId}/conversations/${newConversationId}`;
//   const updates = {}, lastUpdatedAt = Date.now();
//   updates[friendsConversationsPath] = {
//     friendId,
//     friendName: localStorage.getItem('displayName'),
//     lastUpdatedAt
//   };
//   updates[myConversationsPath] = {
//     friendId,
//     friendName,
//     lastUpdatedAt
//   };
//   return update(dbRef, updates);
// }

function AppBody() {

  // States
  const { conversationId } = useParams();
  const [conversationState, setConversationState] = useState({
    conversationId: '',
    friendName: '',
    friendId: '',
    conversations: {}
  });
  const [profile, setProfile] = useState({});

  // Method that trigegrs google login on a button click
  async function onGoogleLoginClick() {
    console.log("Login button click");
    const user = await signInWithPopupGoogle();
    if(user) {
      const { uid, photoURL, displayName } = user;
      setProfile({uid, photoURL, displayName});
    }
    console.log("Logged in with user", user);
  }

  async function onLogoutClick() {
    await logOut();
    setProfile({});
  }

  async function fetchConversations() {
    const conversations = await getConversations({ uid: profile.uid });
    setConversationState({
      ...conversationState,
      conversations
    });
  }

  useEffect(() => {
    fetchConversations();
  }, [profile]);

  return (
    <div className="App">
        <Container fluid>
          <Row>
            <Col className="sidebar" xs="4">
              <Conversations
                conversationState={conversationState}
                setConversationState={setConversationState}
              />
            </Col>
            <Col className="mainbody" xs="8">
              <Header
                others={{ selectedFriendName : conversationState.friendName }}
                profile={profile}
                actions={{
                  onLogoutClick,
                  onGoogleLoginClick
                }} />
              <section className="mainbody-message-viewer">
                <Chatbox
                  conversationState={conversationState}
                  profile={profile}
                />
              </section>
              <section className="mainbody-message-writer">
                <MessageWriter
                  conversationState={conversationState}
                  profile={profile} />
              </section>
            </Col>
          </Row>
      </Container>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<AppBody />} />
        <Route path="/:conversationId" element={<AppBody />} />
      </Routes>
    </Router>
    
  );
}

export default App;
