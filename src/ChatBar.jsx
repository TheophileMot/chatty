import React, {Component} from 'react';
import PropTypes from 'prop-types';

function ChatBar(props) {
  function onUsernameKeyUp(evt) {
    if (evt.key === 'Enter' && !evt.ctrlKey && !evt.shiftKey && !evt.altKey && !evt.metaKey) {
      const chatbar = document.getElementsByClassName("chatbar-message")[0];
      chatbar.focus();
    }
  }

  function handleMessageKeyUp(evt) {
    const msgText = evt.target.value;
    if (evt.key === 'Enter' && !evt.ctrlKey && !evt.shiftKey && !evt.altKey && !evt.metaKey
       && msgText !== '') {
      const newMessage = {
        username: props.currentUser,
        content: msgText,
        systemFlag: false,
      };
      evt.target.value = '';
      props.onMessageKeyUp(newMessage);
    }
  }

  return (
    <footer className="chatbar">
      <input className="chatbar-username" onKeyUp={onUsernameKeyUp} onBlur={evt => props.onUsernameBlur(evt.target.value)} placeholder="Your Name (Optional)" defaultValue={props.currentUser} />
      <input className="chatbar-message" onKeyUp={handleMessageKeyUp} placeholder="Type a message and hit ENTER" />
    </footer>
  );
}
ChatBar.propTypes = {
  onMessageKeyUp:PropTypes.func,
  onUsernameBlur:PropTypes.func,
  onUsernameKeyUp:PropTypes.func,
  currentUser:PropTypes.string,
}

export default ChatBar;