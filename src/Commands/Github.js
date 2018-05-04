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
                            labels_url:repo.labels_url.split('{')[0],


                            issues
                        });

                    });

                });

            });

            Promise.all(promises).then((arrIssues) => {
                let issues = {},issue;
                let repos = [];

                for (var i = 0; i < arrIssues.length; i++) {
                    repos.push({
                        name:arrIssues[i].name,
                        labels_url:arrIssues[i].labels_url
                    });
                    for (var j = 0; j < arrIssues[i].issues.length; j++) {
                        issue = arrIssues[i].issues[j];
                        if(!issues[issue.name]){
                            issues[issue.name] = {
                                name : issue.name,
                                color : issue.color
                            };
                        }
                    }
                }
                var promis=[];
                for (var i = 0; i < repos.length ; i++) {
                    promis.push(me.updateAllIssues(repos[i],issues));
                }
                Promise.all(promis).then(function(res) {

                });
            });

        });
    }

    updateAllIssues(repo,issues){
        let me = this;
        return new Promise(function(resolve, reject){
            for (var issue in issues) {
                if (issues.hasOwnProperty(issue)) {
                    me.threatIssue(repo.labels_url,issues[issue]);
                }
            }


        });
    }

    threatIssue(url,issue){
        let me=this;
        console.log(url,issue);
        unirest.get(url+"/"+issue.name)
        .headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'token '+me.auth.token,
            'User-Agent': 'Nydas bot'
        }).end(function (response) {
            console.log(response.status);
            if( response.status == 404 ){
                let mysuperissue = {
                    name : issue.name,
                    color : issue.color
                };
                console.log("post" ,mysuperissue);
                unirest.post(url)
                .headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'token '+me.auth.token,
                    'User-Agent': 'Nydas bot'
                }).send(mysuperissue).end(function(res){
                    console.log(res.body);
                });
            }else {
                let mysuperissue = {
                    name : issue.name,
                    color : issue.color
                };
                console.log("patch" ,mysuperissue);
                unirest.patch(url+"/"+issue.name)
                .headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'token '+me.auth.token,
                    'User-Agent': 'Nydas bot'
                }).send(mysuperissue).end(function(res){
                    console.log(res.body);
                });
            }
        });
    }

    format(data){
        let msg = JSON.stringify(data,null,"");
        console.log(msg);
        return msg;
    }
}

module.exports = Github;
