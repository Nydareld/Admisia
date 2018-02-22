let AbstractCommand = require ("../AbstractCommand.js");
var GitHub = require('github-api');

class Github extends AbstractCommand {

    constructor(config,name, bot){
        super(config,name, bot);
        this.connectGithub();
    }

    connectGithub(){
        this.gitHubClient = new GitHub({
            token: this.bot.config.github.token
        });

    }


    run(message, args){


        var nrcom = this.gitHubClient.getOrganization('NRcommunication');
        nrcom.getRepos()
        .then((res) => {
            this.gitHubClient.getIssues(res.data[0].owner.login,res.data[0].name).listLabels().then((res) => {
                console.log(res.data);
                res.data = res.data.map(function(issue){
                    return {
                        name: issue.name,
                        color:issue.color
                    };
                });

                let msg = JSON.stringify(res.data,null,"\t");
                console.log(msg,msg.length);
                message.channel.send("```js\n"+ msg +"```").catch(console.error);
            });

        });
    }
}

module.exports = Github;
