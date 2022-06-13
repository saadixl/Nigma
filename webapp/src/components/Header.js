import { Button, Image } from 'react-bootstrap';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faCirclePlus, faClone } from '@fortawesome/free-solid-svg-icons';

function renderHeaderComponents({ actions, profile }) {
    const { uid, displayName, photoURL } = profile;
    const { onGoogleLoginClick, onLogoutClick } = actions;
    if(displayName && uid) {
        return (
            <section className="mainbody-header-profile">
                {/* Display name of logged in user */}
                <span className="mainbody-header-name">{displayName}</span>

                {/* Profile image of logged in user */}
                <Image className="mainbody-header-img" width="40" height="40" src={photoURL} />

                {/* uid copy button */}
                <CopyToClipboard text={uid}
                    onCopy={() => { toast("You've just copied your uid.", {
                        type: 'success',
                        theme: 'dark'
                })}}>
                    <FontAwesomeIcon className="header-icon" title="Copy your id" icon={faClone} />
                </CopyToClipboard>

                {/* Conversation add button */}
                <FontAwesomeIcon onClick={() => {
                    console.log("Add a new conversation here");
                }} className="header-icon" title="Add contact" icon={faCirclePlus} />

                {/* Logout button */}
                <FontAwesomeIcon className="header-icon" title="Logout" onClick={() => {
                    onLogoutClick();
                }} icon={faArrowRightFromBracket} />
            </section>
        );
    } else {
        // Login button
        return <Button
                onClick={() => {
                    onGoogleLoginClick();
                }} 
                className="mainbody-login-button" 
                variant="dark">Login with Google</Button>
    }
}

function Header(props) {
    const { actions, profile, others } = props;
    const { selectedFriendName } = others;
    return (
        <section className="mainbody-header">
            <span className="mainbody-header-friend-name">{selectedFriendName}</span>
            {renderHeaderComponents({ actions, profile })}
        </section>
    );
}


export default Header;