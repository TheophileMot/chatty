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

    this.socket = null;
  }

  componentDidMount() {
    const serverUrl = 'ws://' + window.location.hostname + ':3001';
    this.socket = new WebSocket(serverUrl);
    console.log('Connected to server.');
  }

  render() {
    return (
      <div>
        <LogoBar />
        <MessageList messages={this.state.messages} />
        <ChatBar
          onUsernameBlur={name => this.handleUserNameBlur(name)}
          onMessageKeyUp={msg => this.handleMessageSubmit(msg)}
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

  handleMessageSubmit(msg) {
    this.sendMessage(msg);
  }

  sendMessage(msg) {
    const messages = [...this.state.messages, msg];
    this.setState({messages});
  }

  sendSystemMessage(msgText) {
    const msg = {
      id: randomize('a0', 6),
      username: null,
      content: msgText,
      systemFlag: true
    }
    this.sendMessage(msg);
  }
}
export default App;