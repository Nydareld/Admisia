let Bot = require("./src/Bot.js");
let botConfig = require("./config/config.json");
let commands = require("./config/commands.json");

let authConfig

try {
    authConfig = require("./config/authConfig.json");
} catch (e) {
    authConfig={}
}


let config = Object.assign({},botConfig,authConfig);
config.commands = commands;

if(!config.discord.token){
    config.discord.token = process.env.DISCORD_TOKEN;
}

let botInstance = new Bot(config);
