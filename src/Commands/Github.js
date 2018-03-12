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
        var me=this,repos=[];
        me.nrcom.getRepos()
        .then((res) => {
            let promises = res.data.map((repo) => {
                repos.push({name:repo.name,url:repo.issues_url.split('{')[0]});
                return new Promise(function(resolve, reject) {
                    me.gitHubClient.getIssues(repo.owner.login,repo.name).listLabels().then((res) => {
                        let issues = res.data.map(function(issue){
                            var issue = {
                                name: issue.name,
                                repos: {

                                },
                                color:issue.color
                            };
                            issue.repos[repo.name]= {
                                url : repo.url,
                                name : repo.name
                            };
                            return issue;
                        });

                        resolve({
                            name:repo.name,
                            url:repo.issues_url.split('{')[0],
                            issues
                        });

                    });

                });

            });

            Promise.all(promises).then((arrIssues) => {
                console.log(JSON.stringify(arrIssues));
                let issues = {},issue;

                for (var i = 0; i < arrIssues.length; i++) {
                    for (var j = 0; j < arrIssues[i].issues.length; j++) {
                        issue = arrIssues[i].issues[j];
                        if(!issues[issue.name]){
                            issues[issue.name] = issue;
                        }else {
                            issues[issue.name].repos[arrIssues[i].name]=issue.repos;
                        }
                    }
                }

                // for (var i = 0; i < issues.length; i++) {
                //     issue = issues[i];
                //     for (var j = 0; j < repos.length; j++) {
                //         repo = repos[j];
                //         if(issues){
                //
                //         }
                //     }
                // }
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
