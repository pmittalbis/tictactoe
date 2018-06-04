import ApolloClient from 'apollo-boost';
// import { createNetworkInterface } from 'apollo-client';
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { SubscriptionClient, addGraphQLSubscriptions} from 'subscriptions-transport-ws';
import './index.css';
import App from './components/App';

//  websocket client
// const wsClient = new SubscriptionClient('wss://localhost:5000/graphql', {
// reconnect: true
// });

// //  network interface
// const networkInterface = createNetworkInterface('http://localhost:5000/graphql');

// const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
// networkInterface,
// wsClient,
// );

//  network interface
// const client = new ApolloClient({
// networkInterface: networkInterfaceWithSubscriptions
// });

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
});

ReactDOM.render(<ApolloProvider client={client}>
  <App />
</ApolloProvider>, document.getElementById('root'));
