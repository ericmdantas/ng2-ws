"use strict";

const fs = require('fs');
const express = require('express');
const app = express();
const WebSocketServer = require('ws').Server;

const PORT = 9876;

app.use(express.static('./'));

app.get('/', (req, res) => {
  fs.createReadStream(__dirname + '/app/index.html')
    .pipe(res);
});

const server = require('http').createServer(app)
                              .listen(PORT, () => {
                                console.log(PORT);
                              });

const wss = new WebSocketServer({server: server});

wss.on('connection', (ws) => {
  let _oi = {msg: 'yo!', mem: process.memoryUsage()};

  ws.send(JSON.stringify(_oi));

  ws.on('message', (data, flags) => {
    let _msg = {msg: data, mem: process.memoryUsage()};

    ws.send(JSON.stringify(_msg));
  });
});
