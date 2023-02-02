import express from 'express';
import http from 'http';
import path from 'path';

import { fileURLToPath } from 'url';

import { ExpressPeerServer } from 'peer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || '5000';

const peerServer = ExpressPeerServer(server, {
  proxied: true,
  debug: true,
  path: '/webphone',
  ssl: {},
});

app.use(peerServer);

app.use(express.static(path.join(__dirname, '/dist')));

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '/dist/index.html'));
});

server.listen(port);
console.log(`Listening on: ${port}`);
