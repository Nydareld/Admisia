
let AbstractCommand = require ("../AbstractCommand.js");

class Roulette extends AbstractCommand {

    run(message, args){

        message.delete(100).catch(console.error());

        let author = message.author.username;

        message.channel.send(author + " a pressé la détente....");

        if( (Math.floor( Math.random() * (this.config.barillet || 2) ) +1) == 1){
            message.channel.send("*\CLICK\* la chambre était vide, " + author + " survit");
        }
        else{
            message.channel.send("\*PAN\* " + author + " est retrouvé(e) mort(e) dans le chat");
        }

    }

}

module.exports = Roulette;
