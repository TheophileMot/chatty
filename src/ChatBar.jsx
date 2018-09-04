import randomize from 'randomatic';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

function ChatBar(props) {
  function onUsernameKeyUp(event) {
    if (event.key === 'Enter' && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
      const chatbar = document.getElementsByClassName("chatbar-message")[0];
      chatbar.focus();
    }
  }

  function onMessageKeyUp(event, callback) {
    const messageText = event.target.value;
    if (event.key === 'Enter' && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey
       && messageText !== '') {
      const newMessage = {
        id: randomize('a0', 6),
        username: props.currentUser,
        content: messageText,
        systemFlag: false,
      };
      event.target.value = '';
      callback(newMessage);
    }
  }

  return (
    <footer className="chatbar">
      <input className="chatbar-username" onKeyUp={onUsernameKeyUp} onBlur={event => props.onUsernameBlur(event.target.value)} placeholder="Your Name (Optional)" defaultValue={props.currentUser} />
      <input className="chatbar-message" onKeyUp={event => onMessageKeyUp(event, props.onMessageKeyUp)} placeholder="Type a message and hit ENTER" />
    </footer>
  );
}
ChatBar.propTypes = {
  onMessageKeyUp:PropTypes.function,
  onUsernameKeyUp:PropTypes.function,
  currentUser:PropTypes.string,
}

export default ChatBar;