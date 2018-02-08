let Discord = require("discord.js");
let client = new Discord.Client();

let fs = require("fs");

let config = require("./config.json");

let enums = require("./Enums.js");

client.on("ready", () => {
  console.log("I am ready!");
});

let state = enums.state.idle;

exports.state = state;

//exports.commandBuffer;

client.on("message", (message) => {
  if(message.author.bot || message.content.indexOf(config.prefix) != 0) return;


    let args = message.content.slice(config.prefix.length).trim().split(/ +/g);

    let command = args.shift().toLowerCase();


    try{
      switch(state){
        case enums.state.idle :
            commandFile = require("./Commands/"+ command + ".js");
            commandFile.run(client, message, args);
            break;
          
          case enums.state.waitingUsersInput : 
            commandFile.actionsBuffer.push({"user" : message.author, "action": command});
            if(commandFile.actionsBuffer != 'undefined' && commandFile.actionsBuffer.length >= commandFile.actionsBufferMax){ 
              commandFile.resolve();
            }
        }
      
      

    }catch (err){
      console.error(err);
    }

  });
client.login(config.token);
