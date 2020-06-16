const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv-safe').config();

const routes = require('./routes');
const app = express();
const server = require('http').Server(app);

const PORT = process.env.PORT || 3333;

mongoose.connect(`mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PASSWORD}@${process.env.MONGO_ATLAS_CLUSTER}/${process.env.MONGO_ATLAS_DB}?retryWrites=true&w=majority`, {
  useCreateIndex: true,  
  useNewUrlParser : true, 
  useUnifiedTopology: true,
  useFindAndModify: false
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(PORT);