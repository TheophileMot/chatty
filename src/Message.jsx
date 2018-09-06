import React, {Component} from 'react';

function Message(props) {
  let message = null;
  const { username, content, systemFlag } = props.data;

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
        <span className="message-content rotating">{content}</span>
      </div>
    );
  }

  return message;
}
export default Message;