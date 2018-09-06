import React, {Component} from 'react';
import PropTypes from 'prop-types';

// ROT13 to obfuscate / deobfuscate text: rotate through half the alphabet
function rot13(text) {
  let rotText  = text.replace(/[a-z]/g, c => 'abcdefghijklmnopqrstuvwxyz'['nopqrstuvwxyzabcdefghijklm'.indexOf(c)]);
  rotText  = rotText.replace(/[а-я]/g, c => 'абвгдежзийклмнопрстуфхцчшщъыьэюя'['рстуфхцчшщъыьэюяабвгдежзийклмноп'.indexOf(c)]);
  rotText  = rotText.replace(/[A-Z]/g, c => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'['NOPQRSTUVWXYZABCDEFGHIJKLM'.indexOf(c)]);
  rotText  = rotText.replace(/[А-Я]/g, c => 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'['РСТУФХЦЧШЩЪЫЬЭЮЯАБВГДЕЖЗИЙКЛМНОП'.indexOf(c)]);

  return rotText;
}

function ChatBar(props) {
  function onUsernameKeyUp(evt) {
    if (evt.key === 'Enter' && !evt.ctrlKey && !evt.shiftKey && !evt.altKey && !evt.metaKey) {
      const chatbar = document.getElementsByClassName("chatbar-message")[0];
      chatbar.focus();
    }
  }

  function handleMessageKeyUp(evt) {
    let msgText = evt.target.value;
    if (
      (evt.key === 'Enter' && !evt.ctrlKey && !evt.shiftKey && !evt.altKey && !evt.metaKey)
      && msgText !== ''
    ) {
        const username = props.currentUser;
        if (username.startsWith('rot')) {
          msgText = rot13(msgText);
        }

        const newMessage = {
          username,
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