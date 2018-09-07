const express = require('express');
const WebSocket = require('ws');
const SocketServer = require('ws').Server;
const http = require('http');
const https = require('https');

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

// Create the number ghost. This should eventually be extracted into a separate file
const numberGhost = {
  numberSeq: [],
  prefixes: [],
  suffixes: [],
  replyAfter: 3,
  mull(msg, wss) {
    // if string contains exactly one number, store it and possibly respond
    msg.replace(/^(\D*)(\d+)(\D*)$/, (match, prefix, number, suffix) => {
      this.numberSeq.push(number);
      this.prefixes.push(prefix);
      this.suffixes.push(suffix);

      if (this.numberSeq.length >= this.replyAfter) {
        this.makeGuess(wss);
      }
    });
  },
  makeGuess(wss) {
    const numberSeqCommas = this.numberSeq.join(',');
    const options = {
      host: 'oeis.org',
      port: 443,
      path: `/search?q=${numberSeqCommas}&fmt=json`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    wss.clients.add('👻');
    wss.getJSON(options, (statusCode, res) => {
      if (res.results === null) {
        // no matching pattern; give up and reset
        this.numberSeq = [];
        this.prefixes = [];
        this.suffixes = [];
        return;
      }

      const rx = new RegExp(`${numberSeqCommas},(\\d+)`);
      res.results[0].data.replace(rx, (match, nextNumber) => {
        const randomPrefix = (this.prefixes.length > 0) ? this.prefixes[Math.floor(Math.random() * this.prefixes.length)] : '';
        const randomSuffix = (this.suffixes.length > 0) ? this.suffixes[Math.floor(Math.random() * this.suffixes.length)] : '';
        const punctuation = (res.results.length === 1) ? ' :D' : '?';
        const ghostMessage = `${randomPrefix}${nextNumber}${randomSuffix}${punctuation}`;

        const packet = {
          type: 'ghost',
          data: {
            username: 'number ghost',
            content: ghostMessage,
          },
        }
        wss.clients.delete('👻')
        wss.broadcast(packet);
      });
    });
  },
}

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
      } else {
        numberGhost.mull(parsedPacket.data.content, wss);
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

wss.getJSON = function getJSON(options, onResult) {
    var port = options.port == 443 ? https : http;
    var req = port.request(options, function(res) {
        var output = '';
        console.log(`Received JSON: ${options.host} : ${res.statusCode}`);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
        //res.send('error: ' + err.message);
    });

    req.end();
};