const enums = require("../Enums.js");
const bot = require("../bot.js");

function Run(client, message, args){


    console.log(bot.state);
    bot.state = enums.state.waitingUsersInput;
    console.log(bot.state);

    message.channel.send("Okay ! Choisissez une valeur ! Pierre, feuille, ciseaux !");

}


exports.run = Run;