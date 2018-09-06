const uuid = require('uuid/v1');

// server.js

const express = require('express');
const WebSocket = require('ws');
const SocketServer = require('ws').Server;

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

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => console.log('Client disconnected'));

  ws.on('message', function incoming(packet) {
    // try to parse the packet; otherwise stuff it into a generalized object
    let parsedPacket = {data: packet};
    try {
      parsedPacket = JSON.parse(packet);
    } catch(e) {
      console.log('Warning: received a packet in an unexpected format.');
    }
    if (parsedPacket.type === 'message') {
      wss.broadcast({...parsedPacket, id: uuid()}, [ws]);
    } else if (parsedPacket.type === 'protocol') {
      console.log(`--- Incoming protocol message: ${parsedPacket.data} ---`);
    } else {
      // deal with improper communication here if necessary
      ws.send('Not sure what to do...');
    }
  });
});

// Broadcast to all except those in a given array
wss.broadcast = function broadcast(data, exclude = []) {
  wss.clients.forEach(function each(client) {
    if (!exclude.includes(client) && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};