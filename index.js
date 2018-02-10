let Bot = require("./src/Bot.js");
let botConfig = require("./config/config.json");
let authConfig = require("./config/authConfig.json");
let commands = require("./config/commands.json");


let config = Object.assign({},botConfig,authConfig);
config.commands = commands;

let botInstance = new Bot(config);
