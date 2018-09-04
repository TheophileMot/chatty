import React, {Component} from 'react';

class Message extends Component {  
  render() {
    let message = null;
    const { username, content, systemFlag } = this.props;

    if (systemFlag) {
      message = (
        <div className='message system'>
          {content}
        </div>
      );
    } else {
      message = (
        <div className="message">
          {message}
          <span className="message-username">{username}</span>
          <span className="message-content">{content}</span>
        </div>
      );  
    }

    return message;
 }
}
export default Message;