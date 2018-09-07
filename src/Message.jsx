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
    const bobble = (username.match(/bob/i) !== null) ? 'bobbling' : '';
    const wobble = (username.match(/bob/i) !== null) ? 'wobbling' : '';
    message = (
      <div className={ 'message ' + bobble }>
        <span className={ 'message-username ' + wobble } style={{ color: props.msgColour }}>{ username }</span>
        <span className={ 'message-content ' + wobble }>{ content }</span>
      </div>
    );
  } else if (props.type === 'image-link') {
    message = (
      <div className="message bobbling">
        <span className="message-username wobbling" style={{ color: props.msgColour }}>{ username }</span>
        <img src={ content } />
        <span className="spacer"></span>
      </div>
    );
  } else if (props.type === 'ghost') {
    message = (
      <div className='message ghost bobbling'>
        <div className='ghostly-container'>
          <div className='another-ghostly-container'>
            <span className="message-username ghost">number ghost</span>
            <span className="message-content ghost">{ content }</span>
          </div>
        </div>
      </div>
    );
  }

  return message;
}
export default Message;