exports.run = (client, message, args) => {
    
        message.delete(100).catch(console.error());

        author = message.author.username;

        message.channel.send(author + " a pressé la détente....")

        if(Math.floor(Math.random() * 2) +1 == 1){
            message.channel.send("*\CLICK\* la chambre était vide, " + author + " survit");
        }
        else{
            message.channel.send("\*PAN\* " + author + " est retrouvé(e) mort(e) dans le chat");
        }
    }
    