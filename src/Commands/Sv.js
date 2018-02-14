let AbstractCommand = require ("../AbstractCommand.js");

class Sv extends AbstractCommand {

    run(message, args){
        message.delete(0).catch(console.error());
        let u1 = message.channel.members.random();
        let u2 = message.channel.members.random();
        while (u1.user.username == u2.user.username) {
            u2 = message.channel.members.random();
        }
        let msg = this.config.templates[Math.floor(Math.random()*this.config.templates.length)];
        let tpl = eval('`'+msg+'`');
        message.channel.send(tpl).catch(console.error);
    }
}

module.exports = Sv;
