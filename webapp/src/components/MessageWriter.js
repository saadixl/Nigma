import { Form } from 'react-bootstrap';
import React, { useState } from 'react';
import { sendMessage } from '../api';

function MessageWriter(props) {
    const { conversationState, profile } = props;
    const { conversationId } = conversationState;
    const { uid } = profile;
    const [ message, setMessage ] = useState('');
    return (
        <Form.Control
            hidden={!uid || !conversationId}
            value={message}
            type="text" 
            placeholder="Type message here"
            onChange={(e) => { setMessage(e.target.value); }}
            onKeyUp={(e) => {
                if(e.keyCode === 13) {
                    sendMessage({ 
                        text: message, 
                        conversationId,
                        uid
                    });
                    setMessage('');
                }
            }}
        />
    );
}

export default MessageWriter;