let AbstractCommand = require ("../AbstractCommand.js");

class Ping extends AbstractCommand {

    run(message, args){
    }

    runMamba(message, args){
        message.channel.send("https://cdn.discordapp.com/attachments/410397792167526422/412612076670812162/DFg0x2uWsAA0RNK.png").catch(console.error);
    }

    initialise(){
        let me = this;
        me.initialised = new Promise(function(resolve, reject) {
            me.bot.addPreg("mamba\\sles\\s?couilles",me.runMamba);
            resolve(me);
        });
    }

}

module.exports = Ping;
