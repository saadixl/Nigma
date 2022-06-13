import { ListGroup } from 'react-bootstrap';
import moment from 'moment';
import { useNavigate } from "react-router-dom";

function renderConversations(props, navigate) {
    // Props
    const { conversationState, setConversationState } = props;
    const { conversations, conversationId } = conversationState;

    // Traverse conversations
    return Object.keys(conversations).map((key) => {
        const conversation = conversations[key];
        const { friendName, lastUpdatedAt, friendId } = conversation;
        // Render conversations
        return (<ListGroup.Item
            active={key === conversationId}
            key={key}
            as="li"
            className="d-flex justify-content-between align-items-start"
            onClick={() => {
                setConversationState({
                    ...conversationState,
                    conversationId: key,
                    friendName,
                    friendId,
                });
                navigate(`/${key}`);
            }}
            >
            <div className="ms-2 me-auto">
                <div className="fw-bold">{friendName}</div>
                {moment.duration((lastUpdatedAt - Date.now())/1000/60, "minutes").humanize(true)}
            </div>
        </ListGroup.Item>);
    });
}

function Conversations(props) {
    let navigate = useNavigate();
    return (
        <ListGroup className="conversation-list" as="ol">
            {renderConversations(props, navigate)}
        </ListGroup>
    );
}

export default Conversations;