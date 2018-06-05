const cors = require('cors');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema/schema.js');
/**/
const {createServer} = require('http');
const {graphqlExpress, graphiqlExpress} = require('graphql-server-express');
const bodyParser = require('body-parser');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { subscribe, execute } = require('graphql');
/**/
const PORT = 5000;
const app = express();
app.use(cors());

mongoose.connect('mongodb://localhost:27017/tictactoe');
mongoose.connection.once('open', () => {
  console.log('connected to db...');
});
/**/
app.use(bodyParser.json())
app.use('/graphql', graphqlExpress({
  schema,
  // graphiql: true
}));
app.use('/graphiql', graphiqlExpress({
	endpointURL: '/graphql',
	subscriptionEndpoint: `ws://localhost:${PORT}/subscriptions`,
}));
const server = createServer(app);
/**/
server.listen(PORT, (err) => {
	console.log("Listening.......");
	if (err) throw err;
	 SubscriptionServer.create(                                                                  
    {execute, subscribe, schema, onConnect: console.log('connected to subscriptions......')},                        
    {server, path: '/subscriptions'},                                                         
  );    
	// new SubscriptionServer({
	// 	schema,
	// 	execute,
	// 	subscribe,
	// 	onConnect: () => ),
	// },
	// {
	// 	server,
	// 	path: '/subscriptions',
	// });
  console.log(`Listening at Port ${PORT}...`);
});
