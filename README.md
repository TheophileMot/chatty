Chatty
======

A simple chat app for multiple users, using React.

### Installation

```
npm install
```

Then: from `./chatty-server/`, start up the server:
```
node server.js
```

Finally,  from the main directory, 
```
npm start
open http://localhost:3000
```

### Usage

Just start typing messages in the chat bar!

You can change your user name in the lower left. Users are assigned colours randomly: specifically, their UUID is parsed into a hex colour, and since the UUID is associated only with the websocket client, a user's colour will remain constant even they change their name.

The system sends out notifications when a user connects, disconnects, or changes name. The total number of connected users is displayed in the top right.

There are two user names that produce special effects.

Finally, there is a friendly number ghost.

### Special user names

There are two effects associated with certain user names:

* Messages written by a user whose name contains 'rot' will be transformed through ROT13.
* Messages written by a user whose name contains 'bob' will bob.

### Friendly number ghost

A number ghost listens in on the conversation and tries to join in. For example:

![number ghost](https://raw.githubusercontent.com/TheophileMot/chatty/master/screenshots/Chatty-number-ghost.png)

### Dependencies

* React
* Webpack
* [babel-loader](https://github.com/babel/babel-loader)
* [webpack-dev-server](https://github.com/webpack/webpack-dev-server)
