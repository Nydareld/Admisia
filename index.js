let Bot = require("./src/Bot.js");
let botConfig = require("./config/config.json");
let commands = require("./config/commands.json");

let authConfig;

try {
    authConfig = require("./config/authConfig.json");
} catch (e) {
    authConfig={};
}


let config = Object.assign({},botConfig,authConfig);
config.commands = commands;

if(!config.discord ){
    config.discord = {};
}
if (!config.discord.token) {
    config.discord.token = process.env.DISCORD_TOKEN;
}
if(!config.mongo ){
    config.mongo = {};
}
console.log("toto");
if (!config.mongo.url) {
    config.mongo.url = process.env.MONGODB_ADDON_URI;
}

const http = require('http');
const server = http.createServer((request, response) => {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end(" \n");
});
server.listen(8080, '0.0.0.0');
console.log("http serveur run");

let botInstance = new Bot(config);
