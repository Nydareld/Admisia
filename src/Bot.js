let Discord = require("discord.js");
let fs = require("fs");
let enums = require("./Enums.js");
let ucfirst = require("./utils/ucfirst.js");
let mongoose = require('mongoose');

let defaultConfig = {
    "commands" : {
        "decris" : true
        // "ping" : true,
        // "reload" : true,
        // "roulette" : true,
        // "rockpapercisor" : true
    },
    "prefix" : "!"
};



class Bot {

    constructor(config){

        console.log("Starting bot");
        this.config = Object.assign({}, defaultConfig,config );;

        console.log("Connecting to external systems");
        this.connectMongo();
        this.client = new Discord.Client();
        this.loadClientEvents();
        this.loginClient();

        console.log("Setting bot state");
        this.setState( enums.state.idle );

        console.log("Registering commands");
        this.commands = {};
        this.registerCommands();

    }

    connectMongo(){
        let me = this;
        mongoose.connect(me.config.mongo.url);
        me.dbConnection = mongoose.connection;
        me.dbConnection.on('error', console.error.bind(console, 'connection error:'));
        me.dbInitialized = new Promise(function(resolve) {
            me.dbConnection.once('open', function() {
                console.log("Mongo connected");
                resolve(true);
            });
        });
    }

    registerCommands(){
        let commandClass, commandName;
        for (commandName in this.config.commands) {
            commandClass = require("./Commands/"+ ucfirst(commandName) + ".js");
            this.commands[commandName] = new commandClass(this.config.commands[commandName],this);
        }
    }

    loadClientEvents(){
        let me = this;
        me.discordInitialized = new Promise(function(resolve) {
            me.client.on("ready", ()=>{
                console.log("Discord ready");
                resolve(true);
            });
        }).catch((err) => {console.log(err);});

        this.client.on("message", this.processMessage.bind(this) );
    }

    processMessage(message){

        if(message.author.bot || message.content.indexOf(this.config.prefix) != 0){
            return;
        }

        let args = message.content.slice(this.config.prefix.length).trim().split(/ +/g);

        if(this.state == enums.state.waitingUsersInput ){

            this.reply(message,args);

        }else {

            let commandName = args.shift().toLowerCase();
            let command = this.commands[commandName];
            if( !command ){
                return;
            }else {
                command.run(message, args);
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

    setState(state){
        // mise dans une fonction pour eventuelement changer le comportement
        this.state = state;
    }

    loginClient(){
        this.client.login(this.config.discord.token).then((value) => {console.log("Discord logged");});
    }

}


module.exports = Bot;
