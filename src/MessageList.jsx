import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends Component {
  render() {
    const messages = this.props.messages;

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