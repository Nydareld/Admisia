const fs = require("fs");

exports.run = (client, message, args) =>{



  //const modRole = message.guild.roles.find("name", "Mods");

 /* if(!modRole){
    return console.error("Ce rôle n'existe pas");
  }*/

  //if(message.member.roles.has(modRole.id)){

    fs.readdir("./Commands/", (err, files) => {
      if(err) return console.error(err);

      files.forEach(file =>{

        delete require.cache[require.resolve("./"+ file)];
      });
    });
    console.log("Les commandes ont été rafraichies");
  //}
  /*else{
    message.channel.reply("Minute papillon, t'as pas le droit a cette commande !");
  }*/
}
