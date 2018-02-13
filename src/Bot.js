let Discord = require("discord.js");
let fs = require("fs");
let enums = require("./Enums.js");
let ucfirst = require("./utils/ucfirst.js");
let mongoose = require('mongoose');

class Bot {

    constructor(config){

        this.loadConfig(config)
        .then(this.connectExternals.bind(this))
        .then(this.setDefaultState.bind(this))
        .then(this.registerCommands.bind(this))
        .then(() => {
            console.log("5 bot initialisé");
        });

    }

    loadConfig(config){
        console.log("1 loading configuration");

        let me = this,
        defaultConfig = {
            "commands" : {
                "decris" : true
                // "ping" : true,
                // "reload" : true,
                // "roulette" : true,
                // "rockpapercisor" : true
            },
            "prefix" : "!"
        };

        return new Promise(function(resolve) {
            me.config = Object.assign({}, defaultConfig,config );
            resolve();
        });
    }

    connectExternals(){
        let me = this;

        console.log("2 Connecting to external systems");
        me.connectMongo();
        me.client = new Discord.Client();
        me.loadClientEvents();
        me.loginClient();

        return Promise.all([
            me.dbInitialized,
            me.discordInitialized
        ]);
    }

    setDefaultState(){
        console.log("3 Setting bot state");
        return this.setState( enums.state.idle );
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
        console.log("4 Registering commands");
        let me = this,
        promises = [];
        me.commands = {};
        me.pregs = [];

        let commandClass, commandName;
        for (commandName in me.config.commands) {
            commandClass = require("./Commands/"+ ucfirst(commandName) + ".js");
            me.commands[commandName] = new commandClass(me.config.commands[commandName],commandName,me);
            promises.push(me.commands[commandName].initialised.then((command) => {
                console.log(command.name+" initialised");
            }));
        }
        return Promise.all(promises);

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

        if(message.author.bot){
            return;
        }

        let args = message.content.slice(this.config.prefix.length).trim().split(/ +/g);

        for (var pregPatern of this.pregs) {
            if (pregPatern.preg.exec(message)) {
                pregPatern.callback(message, args);
                return ;
            }
        }

        if( message.content.indexOf(this.config.prefix) != 0){
            return;
        }

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
        let me = this;
        return new Promise(function(resolve, reject) {
            // mise dans une fonction pour eventuelement changer le comportement
            me.state = state;
            resolve(me);
        });
    }

    loginClient(){
        this.client.login(this.config.discord.token).then((value) => {console.log("Discord logged");});
    }

    addPreg(preg,callback){
        this.pregs.push({
            "preg" : new RegExp(preg),
            callback
        });
    }

}


module.exports = Bot;
