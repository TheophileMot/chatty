import React, {Component} from 'react';
import Message from './Message.jsx';

function MessageList(props) {
  const messages = props.messages;

  return (
    <main className="messages">
      { messages.map(message => {
        const { id, sender, ...rest } = message;
        const msgColour = colourById(sender);
        if (rest.display === false) {
          return null;
        }

        return <Message key={ id } { ...rest } msgColour={ msgColour } />
      }) }
    </main>
  );
}
export default MessageList;

function colourById(uuid) {
  if (uuid === undefined) {
    return '#000';
  }
  
  // remove first bit from Green component to make sure that resulting colour is dark
  const limitGreen = parseInt('111111110111111111111111', 2)
  return '#' + ((parseInt(uuid, 16) % 256 ** 3) & limitGreen).toString(16);
}