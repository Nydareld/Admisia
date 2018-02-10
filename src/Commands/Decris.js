let AbstractCommand = require ("../AbstractCommand.js");

class Decris extends AbstractCommand {

    run(message, args){
        let response;
        if( args[0] == "ajout"){

        }else if(this.config[args[0]]){
            response = this.oneCase(this.config[args[0]]);
            console.log(response);
        }else {
            response = "Rien n'est configuré pour cette personne";
        }

        message.channel.send(response).catch(console.error);
    }

    oneCase(arr){
        let cases = this.allPossibleCases(arr);

        return cases[Math.floor(Math.random()*cases.length)];
    }

    allPossibleCases(arr) {
        if (arr.length === 0) {
            return [];
        }
        else if (arr.length ===1){
            return arr[0];
        }
        else {
            var result = [];
            var allCasesOfRest = this.allPossibleCases(arr.slice(1));  // recur with the rest of array
            for (var c in allCasesOfRest) {
                for (var i = 0; i < arr[0].length; i++) {
                    result.push(arr[0][i] +" " + allCasesOfRest[c]);
                }
            }
            return result;
        }
    }
}

module.exports = Decris;
