import React, {Component} from 'react';
import Message from './Message.jsx';

function MessageList(props) {
  const messages = props.messages;

  return (
    <main className="messages">
      {messages.map(message => {
        const {id, ...rest} = message;
        return <Message key={id} {...rest} />
      })}
    </main>
  );
}
export default MessageList;