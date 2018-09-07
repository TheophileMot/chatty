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
  } else if (props.type === 'message') {
    message = (
      <div className="message bobbling">
        <span className="message-username wobbling" style={{ color: props.msgColour }}>{ username }</span>
        <span className="message-content wobbling">{ content }</span>
      </div>
    );
  } else if (props.type === 'image-link') {
    message = (
      <div className="message bobbling">
        <span className="message-username wobbling" style={{ color: props.msgColour }}>{ username }</span>
        <img src={ content } />
        <span className="spacer"></span>
      </div>
    )
  }

  return message;
}
export default Message;