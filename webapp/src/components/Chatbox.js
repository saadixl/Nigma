import { getDatabase, ref, child, get, onValue } from '../firebase';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

function renderMessages({conversation, friendName, uid}) {
    if(!conversation) {
        return null;
    }
    return Object.keys(conversation).map((key) => {
        const message = conversation[key];
        const { text, friendId, timestamp } = message;
        const msgTs = moment(timestamp).format("LLLL");
        let messageComp;
        if(friendId === uid) {
            messageComp = <div key={key} className="own message-item">
                <p className="small chatter-name">You · {msgTs}</p>
                <p className="chat-text">{text}</p>
            </div>;
        } else {
            messageComp = <div key={key} className="friend message-item">
                <p className="small chatter-name">{friendName} · {msgTs}</p>
                <p className="chat-text">{text}</p>
            </div>;
        }
        return messageComp;
    });
}
function Chatbox(props) {
    const { conversationState, profile } = props;
    const { conversationId, friendName } = conversationState;
    const { uid } = profile;
    const [conversation, setConversation] = useState({});
    useEffect(() => {
        if(conversationId) {
            console.log("Fetching via conversationId", conversationId);
            const dbRef = ref(getDatabase());
            const conversationPath = `conversations/${conversationId}`;
            get(child(dbRef, conversationPath)).then((snapshot) => {
                if (snapshot.exists()) {
                    setConversation(snapshot.val());
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });

            onValue(ref(getDatabase(), conversationPath), (snapshot) => {
                if (snapshot.exists()) {
                    setConversation(snapshot.val());
                } else {
                    console.log("No data available");
                }
            });

        } else {
            setConversation();
        }
    }, [conversationId]);
    return (
        <div className="message-item-wrapper">
            {renderMessages({conversation, friendName, uid})}
        </div>
    );
}

export default Chatbox;