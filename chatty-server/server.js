const express = require('express');
const WebSocket = require('ws');
const SocketServer = require('ws').Server;

const uuid = require('uuid/v1');

// URL validator: see https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
const urlRegEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');
  wss.broadcastSystemMessage('A new user has joined the chat.');

  ws.id = uuid();

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
    wss.broadcastSystemMessage('A user has disconnected.');
  });

  ws.on('message', function incoming(packet) {
    // try to parse the packet; otherwise stuff it into a generalized object
    let parsedPacket = {};
    try {
      parsedPacket = JSON.parse(packet);
      parsedPacket.sender = ws.id;
    } catch(e) {
      console.log('Warning: received a packet in an unexpected format.');
      return;
    }

    if (parsedPacket.type === 'message') {
      if (isLinkToImage(parsedPacket.data.content)) {
        parsedPacket.type = 'image-link';
      }
      wss.broadcast(parsedPacket, []);
    } else if (parsedPacket.type === 'system') {
      wss.broadcast(parsedPacket, []);
    } else if (parsedPacket.type === 'protocol') {
      console.log(`--- Incoming protocol message: ${parsedPacket.data} ---`);
    } else {
      // deal with improper communication here if necessary
      console.log(`Received packet with unknown type. Not sure what to do.\n${parsedPacket}`);
    }
  });
});

// Broadcast to all except those in a given array
wss.broadcast = function broadcast(packet, excludedUsers = []) {
  // stamp packet with uuid if it doesn't already have an id;
  // also broadcast # clients
  const id = packet.id || uuid();
  const numClients = wss.clients.size;
  const stringifiedPacket = JSON.stringify({ ...packet, id, numClients });

  wss.clients.forEach(function each(client) {
    if (!excludedUsers.includes(client) && client.readyState === WebSocket.OPEN) {
      client.send(stringifiedPacket);
    }
  });
};

wss.broadcastSystemMessage = function broadcastSystemMessage(msgText) {
  const packet = {
    type: 'system',
    data: {
      username: null,
      content: msgText,
    },
  }
  wss.broadcast(packet, []);
}

function isLinkToImage(str) {
  return str.match(urlRegEx) && str.match(/\.(png|gif|jpg)$/i);
}