import express from 'express';
import { port } from '../config.json';

const server = express();

server.all('/', (req, res) => res.send('OK'));

const keepAlive = () => {
  server.listen(port, () => console.log('Server is ready!'));
};

export default keepAlive;
