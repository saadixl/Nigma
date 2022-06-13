import { Form } from 'react-bootstrap';
import React, { useState } from 'react';
import { getDatabase, ref, child, push, update } from '../firebase';

function sendMessage({ text, conversationId, myUid }) {
    const dbRef = ref(getDatabase());
    const newMessageId = push(child(dbRef, `conversations/${conversationId}`)).key;
    const updates = {}, timestamp = Date.now();
    updates[`/conversations/${conversationId}/${newMessageId}`] = {
        text,
        friendId: myUid,
        timestamp
    };
    updates[`/users/${myUid}/conversations/${conversationId}/lastUpdatedAt`] = timestamp;
    return update(dbRef, updates);
}

function MessageWriter(props) {
    const { selectedConversationId, myUid } = props;
    const [ message, setMessage ] = useState('');
    return (
        <Form.Control
            hidden={!myUid || !selectedConversationId}
            value={message}
            type="text" 
            placeholder="Type message here"
            onChange={(e) => { setMessage(e.target.value); }}
            onKeyUp={(e) => {
                if(e.keyCode === 13) {
                    sendMessage({ 
                        text: message, 
                        conversationId: selectedConversationId,
                        myUid
                    });
                    setMessage('');
                }
            }}
        />
    );
}

export default MessageWriter;