let AbstractCommand = require ("../AbstractCommand.js");

class Malou extends AbstractCommand {

    run(message, args){
        let msg ="";
        if(args[0]){
            msg = this.getParagraph(args[0]);
        }else {
            msg = this.getParagraph();
        }
        message.channel.send(msg).catch(console.error);
    }

    getParagraph(nb_sentences = 1) {
        var paragraph = "";
        for (var i = 0; i < nb_sentences; i++) {
            paragraph += "     "+this.getSentence()+"\n";
        }
        return paragraph;
    }

    getSentence() {
        var sentence = "";
        for (var i = 0; i < 8; i++) {
            sentence += this.random( this.config.sentences[i] ) + " ";
        }
        return sentence;
    }

    random(sentences) {
        return sentences[Math.floor(Math.random() * sentences.length)];
    }

}

module.exports = Malou;
