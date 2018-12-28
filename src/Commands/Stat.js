let AbstractCommand = require ("../AbstractCommand.js");

class Stat extends AbstractCommand {

    run(message, args){
        message.channel.send("Pour un comptage statistique des personnes réelements présentes, veuillez de me mentioner dans un message.").catch(console.error);
    }

    initialise(){
        this.bot.client.on("message", (message)=>{

            let bot = message.mentions.users.find("id",this.bot.client.user.id);
            if(bot){
                message.author.send('https://cdn.discordapp.com/attachments/412685242395131915/528006038025273345/FfFaSEiy.png')
                .catch(console.error);
            }
        });
        super.initialise();
    }

}

module.exports = Stat;
