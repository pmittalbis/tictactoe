const cors = require('cors');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema/schema.js');

const app = express();
app.use(cors());

mongoose.connect('mongodb://localhost:27017/tictactoe');
mongoose.connection.once('open', () => {
  console.log('connected to db...');
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(5000, () => {
  console.log('Listening at Port 4000...');
});
