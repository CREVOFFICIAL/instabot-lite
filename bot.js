const config = require("./config");
const Bot = require("./lib");
let bot = new Bot(config);
bot.start();
