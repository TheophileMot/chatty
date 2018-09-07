import React, {Component} from 'react';

function LogoBar(props) {
  const user_s = (props.numClients === 1) ? 'user' : 'users';
  const numUsersText = `${props.numClients} ${user_s} online`;

  return (
    <nav className="navbar">
      <a href="/" className="navbar-brand">Chatty</a>
      <div className="numUsers">{ numUsersText }</div>
    </nav>
  );
}
export default LogoBar;