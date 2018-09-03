import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import LogoBar from './LogoBar.jsx';

class App extends Component {
  render() {
    return (
      <div>
        <LogoBar />
        <MessageList />
        <ChatBar />
      </div>
    );
  }
}
export default App;
