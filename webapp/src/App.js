import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './components/Header';
import Conversations from './components/Conversations';
import Chatbox from './components/Chatbox';
import MessageWriter from './components/MessageWriter';
import { signInWithPopupGoogle, logOut, getConversations, createNewConversation } from './api';


function AppBody() {

  // States
  const { conversationId } = useParams();
  const [conversationState, setConversationState] = useState({
    conversationId,
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

  async function onCreateNewConversation({ friendName, friendId }) {
    await createNewConversation({
      profile,
      friendName,
      friendId
    });
    fetchConversations();
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
                  onGoogleLoginClick,
                  onCreateNewConversation
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
