let AbstractCommand = require ("../AbstractCommand.js");

class Decris extends AbstractCommand {

    run(message, args){
        console.log('run');
        message.channel.send("pong!").catch(console.error);
    }

}

module.exports = Decris;
