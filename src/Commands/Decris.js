let AbstractCommand = require ("../AbstractCommand.js");

class Decris extends AbstractCommand {

    run(message, args){
        let response;
        if( args[0] == "ajout"){
            response = this.add(args);
        }else if( args[0] == "export"){
            response = this.exports(args);
        }else if( args[0] == "import"){
            response = this.imports(args);
        }else if(this.config[args[0]]){
            response = this.oneCase(this.config[args[0]]);
        }else {
            response = "Rien n'est configuré pour cette personne";
        }

        message.channel.send(response).catch((err) => {console.log("err",err);});
    }

    add(args){
        if(args.length < 4){
            return 'Il manque des arguments a votre comande. la syntaxe est la suivante : !decris ajout <nom> <emplacement des mot> <mots>';
        }else if(args[2] > 3){
            return "L'emplacement ne peut pas etre superieur à 3";
        }else{
            if(!this.config[args[1]]){
                this.config[args[1]] = [[],[],[]];
            }
            let mots = args.splice(3, args.length ).join(" ")
            this.config[args[1]][(args[2]*1)-1].push(mots);
            return '"'+mots+'" ont bien étés ajoutés a '+args[1];
        }

    }


    exports(args){
        if(args.length < 2){
            return 'Il manque des arguments a votre comande. la syntaxe est la suivante : !decris export <nom>';
        }else {
            return JSON.stringify(this.config[args[1]]);
        }
    }

    imports(args){
        if(args.length < 3){
            return 'Il manque des arguments a votre comande. la syntaxe est la suivante : !decris export <nom> <configuration précédement exportée>';
        }
        try {
            this.config[args[1]] = JSON.parse( args.splice(2, args.length ).join(" ") );
            return "La configuration a bien été importée";
        } catch (e) {
            console.log(e);
            return "Il semble qu'il y ait une erreur de configuration";
        }
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
