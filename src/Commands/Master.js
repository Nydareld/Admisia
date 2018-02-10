let AbstractCommand = require ("../AbstractCommand.js");

class Decris extends AbstractCommand {

    run(message, args){
        if(args.length == 0){
            message.channel.send("Qui ca ?").catch((err) => {console.log("err",err);});
            return;
        }
        if(args[0].match(/Nyda/) || args[0].match(/nyda/)){
            message.channel.send(args[0]+" est le maitre absolue").catch((err) => {console.log("err",err);});
        }else if(args[0].match(/Nida/) || args[0].match(/nida/)){
            message.channel.send("je connais pas de "+args[0]).catch((err) => {console.log("err",err);});
        }else{
            message.channel.send(args[0]+" est une grosse merde").catch((err) => {console.log("err",err);});
        }

    }
}

module.exports = Decris;
