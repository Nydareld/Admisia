let AbstractCommand = require ("../AbstractCommand.js");

class Sv extends AbstractCommand {

    run(message, args){
        message.delete(0).catch(console.error());
        let u1 = message.channel.members.random();
        let u2 = message.channel.members.random();
        let x=0;
        while (
            ((u1.user.username == u2.user.username) ||
            (u1.presence.status == "offline") ||
            (u1.user.bot) ||
            (u2.presence.status == "offline") ||
            (u2.user.bot)) && x<100
        ){
            if(
                (u1.user.username == u2.user.username)||
                (u1.presence.status == "offline") ||
                (u1.user.bot)
            ){
                u1 = message.channel.members.random();
            }else {
                u2 = message.channel.members.random();
            }
            x++;
        }
        console.log(x);
        console.log(u1.presence.status,u1.user.bot);
        console.log(u2.presence.status,u2.user.bot);
        let msg = this.config.templates[Math.floor(Math.random()*this.config.templates.length)];
        let tpl = eval('`'+msg+'`');
        message.channel.send(tpl).then((value) => {}).catch(console.error);
    }
}

module.exports = Sv;
