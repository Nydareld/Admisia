let AbstractCommand = require ("../AbstractCommand.js");

class Ping extends AbstractCommand {

    run(message, args){
    }

    runMamba(message, args){
        message.channel.send("https://cdn.discordapp.com/attachments/410397792167526422/412612076670812162/DFg0x2uWsAA0RNK.png").catch(console.error);
    }

    runSamba(message, args){
        message.channel.send("https://cdn.discordapp.com/attachments/351809045067202572/413042760841691156/unknown.png").catch(console.error);
    }

    initialise(){
        let me = this;
        me.initialised = new Promise(function(resolve, reject) {
            me.bot.addPreg("mamba\\sles\\s?couilles",me.runMamba);
            me.bot.addPreg("samba\\sles\\s?couilles",me.runSamba);
            resolve(me);
        });
    }

}

module.exports = Ping;
