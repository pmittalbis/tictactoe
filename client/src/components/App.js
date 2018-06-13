import React, { Component } from 'react';
import Notifications from 'react-notify-toast';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo';
import Board from './Board';
import Header from './Header';
import './App.css';

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:5001/graphql',
});

networkInterface.use([{
  applyMiddleware(req, next) {
    setTimeout(next, 500);
  },
}]);

const wsClient = new SubscriptionClient(`ws://localhost:5001/subscriptions`, {
  reconnect: true,
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  customResolvers: {
  },
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div>
          <Notifications />
          <Header />
          <Board />
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
