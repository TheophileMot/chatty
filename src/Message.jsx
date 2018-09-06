import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Message extends Component {  
  render() {
    let message = null;
    const { username, content, systemFlag } = this.props.data;

    if (systemFlag) {
      message = (
        <div className='message system'>
          {content}
        </div>
      );
    } else {
      message = (
        <div className="message">
          <span className="message-username">{username}</span>
          <span className="message-content">{content}</span>
        </div>
      );  
    }

    return message;
 }
}
export default Message;