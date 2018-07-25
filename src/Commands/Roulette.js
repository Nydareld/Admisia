
let AbstractCommand = require ("../AbstractCommand.js");

class Roulette extends AbstractCommand {

    run(message, args){
        var me = this;
        message.delete(300).catch(console.error());

        let author = message.author.username;

        message.channel.send(author + " prend un révolver qui avec un barillet avec une balle et " + (me.config.barillet - 1) + " emplacements vides");

        setTimeout(function () {
            message.channel.send(author + " met le révolver contre sa tempe");
        }, 2000);

        setTimeout(function(){
            message.channel.send(author + " a presse la détente....");
            if( (Math.floor( Math.random() * (me.config.barillet || 2) ) +1) != 1){
                message.channel.send("*\CLICK\* la chambre était vide, " + author + " survit");
            }
            else{
                message.channel.send("\*PAN\* " + author + " est retrouvé(e) mort(e) dans le chat");
            }
        },4000);

    }

}

module.exports = Roulette;
