import React, {Component} from 'react';

function Message(props) {
  let message = null;
  const { username, content } = props.data;

  if (props.type === 'system') {
    message = (
      <div className='message system'>
        { content }
      </div>
    );
  } else {
    message = (
      <div className="message">
        <span className="message-username wobbling" style={{ color: props.msgColour }}>{ username }</span>
        <span className="message-content wobbling">{ content }</span>
      </div>
    );
  }

  return message;
}
export default Message;