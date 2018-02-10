exports.run = (client, message, args) => {

    //message.delete(1000).catch(console.error());
    message.channel.send("pong!").catch(console.error);
}
