const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

const apiRouter = require('./api')

const http = require('http').createServer(app);
http.listen(8080, function() {
  console.log('listening port 8080');
})

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

app.use(express.urlencoded({ extended: false}));

app.use('/', apiRouter);