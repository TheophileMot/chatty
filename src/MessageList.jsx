import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends Component {
  render() {
    const messages = [
      {
        id: 'as98f7',
        username: 'Anonymous1',
        content: 'I won\'t be impressed with technology until I can download food.',
        systemFlag: false,
      },
      {
        id: '32875a',
        username: null,
        content: 'Anonymous1 changed their name to nomnom.',
        systemFlag: true
      }
    ]

    return (
      <main className="messages">
        {messages.map(message => {
          const {id, ...rest} = message;
          return <Message key={id} {...rest} />
        })}
      </main>
    );
  }
}
export default MessageList;