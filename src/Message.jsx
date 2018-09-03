import React, {Component} from 'react';

class Message extends Component {  
  render() {
    let message = null;
    const { username, content, systemFlag } = this.props;

    if (systemFlag) {
      message = (
        <div className='message system'>
          {this.props.content}
        </div>
      );
    } else {
      message = (
        <div className="message">
          {message}
          <span className="message-username">Anonymous1</span>
          <span className="message-content">I won't be impressed with technology until I can download food.</span>
        </div>
      );  
    }

    return <p>{message}</p>
 }
}
export default Message;