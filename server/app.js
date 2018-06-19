import cors from 'cors';
import express from 'express';
import {
  graphqlExpress,
  graphiqlExpress
} from 'graphql-server-express';
import bodyParser from 'body-parser';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import mongoose from 'mongoose';

import { schema } from './schema/schema.js';

mongoose.connect('mongodb://localhost:27017/tictactoe');
mongoose.connection.once('open', () => {
  console.log('connected to db...');
});

const PORT = 5001;
const server = express();

// wrap the Express Server
const ws = createServer(server);

ws.listen(PORT, (err) => {
  if (err) throw err;
  new SubscriptionServer({
    execute,
    subscribe,
    schema,
    onConnect: console.log('connected to subscriptions......')
  }, {
      server: ws,
      path: '/subscriptions'
  });
  console.log(`Listening at Port ${PORT}...`);
});

server.use('*', cors({ origin: '*' }));

server.use('/graphql', bodyParser.json(), graphqlExpress({
  schema,
}));

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
}));
