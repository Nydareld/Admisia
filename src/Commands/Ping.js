let AbstractCommand = require ("../AbstractCommand.js");

class Ping extends AbstractCommand {

    run(message, args){
        message.channel.send("pong!").catch(console.error);
    }
}

module.exports = Ping;
