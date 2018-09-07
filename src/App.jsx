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
      numClients: 0,
      messages: [],
    }

    this.socket = null;
  }
  
  componentDidMount() {
    this.setUpServerConnection();

    // fake messages to demonstrate number ghost: uncomment the following lines for demo
    /*
    setTimeout(() => {
      const msg = {
        id: '5d16310e-00a0-46bb-bbc8-1805495c366a',
        type: 'message',
        data: {
          username: 'sarah',
          content: 'hey, have you done question 13 yet?'
        }
      };
      this.socket.send(JSON.stringify(msg));
    }, 3000);
    setTimeout(() => {
      const msg = {
        id: '181d9f21-073d-4eac-82f7-311a24f5d5c7',
        type: 'message',
        data: {
          username: 'amir',
          content: 'no, I\'m still working on 8... almost there'
        }
      };
      this.socket.send(JSON.stringify(msg));
    }, 9000);
    setTimeout(() => {
      const msg = {
        id: '1e2d81bb-8496-4dd2-812d-880435641dda',
        type: 'message',
        data: {
          username: 'amir',
          content: 'should be done in 5 minutes or so'
        }
      };
      this.socket.send(JSON.stringify(msg));
    }, 12000);
    */
  }

  render() {
    return (
      <div>
        <LogoBar numClients={ this.state.numClients } />
        <MessageList messages={ this.state.messages } />
        <ChatBar
          onUsernameBlur={ name => this.handleUserNameBlur(name) }
          onMessageKeyUp={ msg => this.handleMessageSubmit(msg) }
          currentUser={ this.state.currentUser }
        />
      </div>
    );
  }

  setUpServerConnection() {
    const serverUrl = 'ws://' + window.location.hostname + ':3001';
    this.socket = new WebSocket(serverUrl);
    
    this.socket.onopen = evt => {
      this.sendMessage('Hallo, I am connecting.', 'protocol');
      console.log('Connected to server.');
    }

    this.socket.onmessage = evt => {
      const messages = [...this.state.messages, JSON.parse(evt.data)];
      this.setState({ numClients: JSON.parse(evt.data).numClients });
      this.setState({ messages });
    }
  }

  handleUserNameBlur(name) {
    const newName = name || 'anonymous';

    if (newName !== this.state.currentUser) {
      this.sendSystemMessage(`${this.state.currentUser} changed their name to ${newName}.`);
      this.setState({ currentUser: newName });
    }
  }

  handleMessageSubmit(msg) {
    this.sendMessage(msg);
  }

  sendMessage(msg, type = 'message') {
    const packet = {
      type,
      data: msg,
    }
    this.socket.send(JSON.stringify(packet));
  }

  sendSystemMessage(msgText) {
    const msg = {
      username: null,
      content: msgText,
    }
    this.sendMessage(msg, 'system');
  }
}
export default App;