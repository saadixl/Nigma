import { getDatabase, ref, onValue } from '../firebase';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { getConversation } from '../api';
import { decrypt } from '../utils';

function renderMessages({conversation, friendName, uid, rotorCode}) {
    if(!conversation) {
        return null;
    }
    return Object.keys(conversation).map((key) => {
        const message = conversation[key];
        const { text, friendId, timestamp } = message;
        const msgTs = moment(timestamp).format("LLLL");
        let messageComp;
        const decryptedMessage = decrypt({ msg: text, rotorCode });
        if(friendId === uid) {
            messageComp = <div key={key} className="own message-item">
                <p className="small chatter-name">You · {msgTs}</p>
                <p className="chat-text">{decryptedMessage}</p>
            </div>;
        } else {
            messageComp = <div key={key} className="friend message-item">
                <p className="small chatter-name">{friendName} · {msgTs}</p>
                <p className="chat-text">{decryptedMessage}</p>
            </div>;
        }
        return messageComp;
    });
}

function Chatbox(props) {
    const { conversationState, profile, rotorCode } = props;
    const { conversationId, friendName } = conversationState;
    const { uid } = profile;
    const [conversation, setConversation] = useState({});

    async function fetchConversations() {
        const conv = await getConversation({ conversationId });
        setConversation(conv);
    }

    function realtimeConversationSync() {
        onValue(ref(getDatabase(), `conversations/${conversationId}`), (snapshot) => {
            if (snapshot.exists()) {
                setConversation(snapshot.val());
            } else {
                console.log("No data available");
            }
        });
    }

    useEffect(() => {
        if(conversationId) {
            console.log("Fetching via conversationId", conversationId);
            // Fetch conversation once
            fetchConversations();
            // Realtime listener
            realtimeConversationSync();
        } else {
            // Remove conversations
            setConversation();
        }
    }, [conversationId]);
    return (
        <div className="message-item-wrapper">
            {renderMessages({conversation, friendName, uid, rotorCode})}
        </div>
    );
}

export default Chatbox;