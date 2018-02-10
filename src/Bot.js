let Discord = require("discord.js");
let fs = require("fs");
let enums = require("./Enums.js");

let defaultConfig = {
    "commands" : {
        "ping" : true,
        "reload" : true,
        "roulette" : true,
        "rockpapercisor" : true
    },
    "prefix" : "!"
};



class Bot {

    constructor(config){
        this.config = Object.assign({}, config, defaultConfig );;
        this.client = new Discord.Client();

        this.setState( enums.state.idle );

        this.commands = {};
        this.registerCommands();
        this.loadClientEvents();

        this.loginClient();

    }

    registerCommands(){
        for (var commandName in this.config.commands) {
            this.commands[commandName] = require("./Commands/"+ commandName + ".js");
        }
    }

    loadClientEvents(){
        this.client.on("ready", this.sendReady );
        this.client.on("message", this.processMessage );
    }

    processMessage(message){
        let command = this.commands[command];
        command.run(client, message, args);

        // if(message.author.bot || message.content.indexOf(this.config.prefix) != 0){
        //     return;
        // }
        //
        // let args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        //
        // let commandName = args.shift().toLowerCase();
        //
        // let command = this.commands[command];
        //
        // if(!command){
        //     return;
        // }
        //
        // try{
        //     switch(this.state){
        //         case enums.state.waitingUsersInput :
        //             if()
        //             command.actionsBuffer.push(message);
        //             break;
        //
        //         default :
        //             if(this.commands[command]){
        //                 this.commands[command].run(client, message, args);
        //             }
        //             break;
        //
        //   }

    }

    sendReady(){
        console.log("I am ready!");
    }

    setState(state){
        // mise dans une fonction pour eventuelement changer le comportement
        this.state = state;
    }

    loginClient(){
        this.client.login(this.config.discord.token);
    }

}


module.exports = Bot;
