let AbstractCommand = require ("../AbstractCommand.js");
var GitHub = require('github-api');

var unirest = require('unirest');

class Github extends AbstractCommand {

    constructor(config,name, bot){
        super(config,name, bot);
        this.connectGithub();
        this.toProtect = {
            master : true,
            prod : true
        };
    }

    connectGithub(){
        this.auth= {
            token: this.bot.config.github.token
        };
        this.gitHubClient = new GitHub(this.auth);
        this.nrcom = this.gitHubClient.getOrganization('NRcommunication');

    }


    run(message, args){

        if (args[0] == 'issues') {
            this.issues(message, args);
        }
        if (args[0] == 'repos') {
            this.repos(message, args);
        }
    }

    repos(message, args){
        var me=this;
        me.nrcom.getRepos()
        .then((res) => {
            for (var i = 0; i < res.data.length; i++) {
                let repo = this.gitHubClient.getRepo(res.data[i].owner.login,res.data[i].name);
                repo.listBranches().then((res) => {
                    res.data.map((item) => {
                        console.log(item.name);
                        if(me.toProtect[item.name]){
                            repo.getBranch(item.name).then((value) => {
                                unirest.put(value.data.protection_url)
                                .headers({
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'Authorization': 'token '+me.auth.token,
                                    'User-Agent': 'Nydas bot'
                                })
                                .send({
                                    required_status_checks: {
                                        strict : true,
                                        contexts : []
                                    },
                                    enforce_admins : null,
                                    required_pull_request_reviews : {
                                        dismissal_restrictions : {
                                            users : ["Nydareld","sguesdon"],
                                            teams : ["owners"],
                                        },
                                        require_code_owner_reviews : true,
                                        dismiss_stale_reviews : false
                                    },
                                    restrictions : {
                                        users : ["Nydareld","sguesdon","wil129"],
                                        teams : ["owners"],
                                    }
                                }).end(function (response) {
                                    console.log(repo.__fullname);
                                    console.log(response.body);
                                });
                            });
                        }
                    });
                });
            }
            // message.channel.send("```js\n"+ me.format(repos) +"```").catch(console.error);

        });
    }

    issues(message, args){
        var me=this;
        me.nrcom.getRepos()
        .then((res) => {
            me.gitHubClient.getIssues(res.data[0].owner.login,res.data[0].name).listLabels().then((res) => {
                console.log(res.data);
                res.data = res.data.map(function(issue){
                    return {
                        name: issue.name,
                        color:issue.color
                    };
                });

                message.channel.send("```js\n"+ me.format(res.data) +"```").catch(console.error);

            });

        });
    }

    format(data){
        let msg = JSON.stringify(data,null,"");
        console.log(msg);
        return msg;
    }
}

module.exports = Github;
