let Discord = require("discord.js");
let fs = require("fs");
let enums = require("./Enums.js");
let ucfirst = require("./utils/ucfirst.js");

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
        this.config = Object.assign({}, defaultConfig,config );;
        this.client = new Discord.Client();
        this.setState( enums.state.idle );

        this.commands = {};
        this.registerCommands();
        this.loadClientEvents();

        this.loginClient();

    }

    registerCommands(){
        for (var commandName in this.config.commands) {
            this.commands[commandName] = require("./Commands/"+ ucfirst(commandName) + ".js");
        }
    }

    loadClientEvents(){
        this.client.on("ready", this.sendReady.bind(this) );
        this.client.on("message", this.processMessage.bind(this) );
    }

    processMessage(message){

        if(message.author.bot || message.content.indexOf(this.config.prefix) != 0){
            return;
        }

        let args = message.content.slice(this.config.prefix.length).trim().split(/ +/g);

        if(this.state == enums.state.waitingUsersInput ){

            this.reply(this, message,args);

        }else {

            let commandName = args.shift().toLowerCase();
            let command = this.commands[commandName];
            if( !command ){
                return;
            }else {
                command.run(this, message, args);
            }

        }

    }

    takeControl(callback){
        this.reply = callback;
        this.state = enums.state.waitingUsersInput;
    }

    releaseControl(){
        this.reply = null;
        this.state = enums.state.idle;
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
