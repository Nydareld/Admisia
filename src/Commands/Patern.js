let AbstractCommand = require ("../AbstractCommand.js");

class Ping extends AbstractCommand {

    run(message, args){
    }

    initialise(){
        let me = this;
        me.initialised = new Promise(function(resolve, reject) {
            for (const patern of me.config) {
                me.bot.addPreg(patern.preg, function (message, args){
                    message.channel
                        .send(patern.message)
                        .catch(console.error);
                });
            }
        });
    }

}

module.exports = Ping;
