import randomize from 'randomatic';

import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import LogoBar from './LogoBar.jsx';

class App extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: true,
      currentUser: 'anonymous',
      messages: [
        {
          id: 'as98f7',
          username: 'anonymous',
          content: 'I won\'t be impressed with technology until I can download food.',
          systemFlag: false,
        },
        {
          id: '32875a',
          username: null,
          content: 'anonymous changed their name to nomnom.',
          systemFlag: true
        }
      ]
    }

    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount <App />');
    setTimeout(() => {
      console.log('Simulating incoming message');
      // Add a new message to the list of messages in the data store
      const newMessage = {id: 3, username: 'Michelle', content: 'Hello there!'};
      const messages = [...this.state.messages, newMessage];
      // Update the state of the app component.
      // Calling setState will trigger a call to render() in App and all child components.
      this.setState({messages: messages})
    }, 3000);
  }

  render() {
    return (
      <div>
        <LogoBar />
        <MessageList messages={this.state.messages} />
        <ChatBar
          onUsernameBlur={name => this.handleUserNameBlur(name)}
          onMessageKeyUp={message => this.handleMessageSubmit(message)}
          currentUser={this.state.currentUser}
        />
      </div>
    );
  }

  handleUserNameBlur(name) {
    const newName = name || 'anonymous';

    if (newName !== this.state.currentUser) {
      this.sendSystemMessage(`${this.state.currentUser} changed their name to ${newName}.`);
      this.setState({currentUser: newName});
    }
  }

  handleMessageSubmit(message) {
    this.sendMessage(message);
  }

  sendMessage(message) {
    const messages = [...this.state.messages, message];
    this.setState({messages});
  }

  sendSystemMessage(messageText) {
    const message = {
      id: randomize('a0', 6),
      username: null,
      content: messageText,
      systemFlag: true
    }
    this.sendMessage(message);
  }
}
export default App;