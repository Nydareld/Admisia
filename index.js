let Bot = require("./src/Bot.js");
let botConfig = require("./config/config.json");
let authConfig = require("./config/authConfig.json");


let config = Object.assign({},botConfig,authConfig);

let botInstance = new Bot(config);
