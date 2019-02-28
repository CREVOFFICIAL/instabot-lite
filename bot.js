
const config = require("./config");
const Bot = require("./lib");
const express = require('express');
const app = express();

const manager = require("./modules/common/state").currentManager;
let bot = new Bot(config);

app.get('/state', function (req, res) {
  res.send(`current state is ${manager.get_status()}`);
});

app.get('/change', function (req, res) {
  testStatus._status ;
  res.send(`change to`);
});

app.get('/start', function (req, res) {
  res.send('hello world');
  bot.start();
});

app.listen(80);



