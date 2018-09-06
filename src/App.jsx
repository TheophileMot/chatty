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
      messages: []
    }

    this.socket = null;
  }

  componentDidMount() {
    this.setUpServerConnection();
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

  setUpServerConnection() {
    const serverUrl = 'ws://' + window.location.hostname + ':3001';
    this.socket = new WebSocket(serverUrl);
    
    this.socket.onopen = evt => {
      this.sendMessage('Hallo, I am connecting.', 'protocol');
      console.log('Connected to server.');
    }

    this.socket.onmessage = evt => {
      const messages = [...this.state.messages, JSON.parse(evt.data)];
      this.setState({messages});
    }
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
      systemFlag: true
    }
    this.sendMessage(msg);
  }
}
export default App;