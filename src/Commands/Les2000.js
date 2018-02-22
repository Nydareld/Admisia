let AbstractCommand = require ("../AbstractCommand.js");

class Les2000 extends AbstractCommand {

    run(message, args){
        message.channel.send("Mets ce que tu veux. J'ai pas d'inspi").catch(console.error);
    }
}

module.exports = Les2000;
