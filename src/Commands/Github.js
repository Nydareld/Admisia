let AbstractCommand = require ("../AbstractCommand.js");
var GitHub = require('github-api');
const octokit = require('@octokit/rest')()

var unirest = require('unirest');

function deepFind(obj, path,value) {
    var paths = path.split('.')
    , current = obj
    , i;

    for (i = 0; i < paths.length; ++i) {
        if (current[paths[i]] == undefined) {
            return undefined;
        } else {
            if( i+1 == paths.length && value){
                current[paths[i]] = value;
            }
            current = current[paths[i]];
        }
    }
    return current;
}

class Github extends AbstractCommand {

    constructor(config,name, bot){
        super(config,name, bot);
        this.connectGithub();
        this.toProtect = {
            master : true,
            prod : true,
            qual : true,

        };
        this.toProtectRepos = [
            'nrcom-inspinia',
            'script-elastic-zones',
            'pl-wordpress',
            'crm-task-manager',
            'AdminLte-Theme-INSPINA',
            'pl-utils',
            'crm-scripts',
            'pbmo-integrateur-xml',
            'generator-nrcom-inspinia',
            'nrcom-ws-core',
            'pl-frontoffice',
            'migration',
            'generator-nrcom-ws-core',
            'nrcom-ws-supports',
            'nrcom-ws-listes',
            'nrcom-ws-customers',
            'nrcom-ws-ci',
            'nrcom-ws-compta',
            'nrcom-ws-zones',
            'nrcom-ws-commerce',
            'pullrequest-chrome-extension',
            'nrcom-ws-reverse-proxy',
            'emploi-frontoffice',
            'pub-frontoffice',
            'pm-frontoffice',
            'immo-frontoffice',
            'pl-backoffice',
            'pub-backoffice',
            'nrcom-ws-inbox',
            'SmartCheck-Server',
            'SmartCheck-Front',
            'SmartCheck-App',
            'nrcom-ws-dev',
            'mongoosastic',
            'crm-cron',
            'nrcom-services',
            'nrcom-pc-ws',
            'Haanga',
            'pro-connect',
            'nrcom-ws-legales',
            'openface',
            'nrcom-openface',
            'nrcom-ws-adgen',
            'htmltopdflib',
            'nrcom-ws-presse',
            'nrcom-jsreport',
            'syncro-pl',
            'pl-cron',
            'nrcom-ws-config',
            'nrcom-ws-jsreport',
            'nrcom-crm',
            'nrco-pybots',
            'nrcom-ws-error',
            'front-error-manager',
            'jsreport-keycloak-auth',
            'aws-lambda-github-release-mailer',
            'lambdaConfigs',
            'aws-lambda-keycloak-config',
            'nrcom-pige',
            'node-red-contrib-amqp3',
            'migration-pl-init-sap',
            'poc-fargate-network',
            'nrcom-lambda-edi-receiver',
            'node-red-contrib-keycloak',
            'nrco-angular-pdfjs-viewer',
            'aws-lambda-pdf-splitter',
            'nrcom-ws-notifications',
            'prolegales-api-php-client',
            'prolegales-api-node-client',
            'nrcom-ws-connecteur'
        ]
    }

    connectGithub(){
        this.auth= {
            token: this.bot.config.github.token
        };
        this.gitHubClient = new GitHub(this.auth);
        this.nrcom = this.gitHubClient.getOrganization('NRCO');

    }


    run(message, args){

        if( !this.bot.config.admins[message.author.id] ){
            return
        }

        if (args[0] == 'issues') {
            this.issues(message, args);
        }
        if (args[0] == 'repos') {
            this.repos(message, args);
        }
        if (args[0] == 'tag') {
            this.tag(message, args);
        }
    }

    repos(message, args){
        var me=this;
        me.nrcom.getRepos()
        .then((res) => {
            for (var i = 0; i < res.data.length; i++) {
                let repo = this.gitHubClient.getRepo(res.data[i].owner.login,res.data[i].name);
                if(me.toProtectRepos.indexOf(res.data[i].name) >= 0  ){
                    repo.listBranches().then((res) => {
                        res.data.map((item) => {
                            if(me.toProtect[item.name]  ){
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

    tag(message, args){
        args.shift();
        let templates,
            repo = args.shift(),
            type = args.shift();

        if( ["major","minor","patch"].indexOf(type) == -1 ){
            message.channel.send("Mettez un type de version entre major, minor, et patch").catch(console.error);
        }


        repo = repo.split("/");

        if(repo.length == 1){
            repo = ["NRCO",repo[0]];
        }

        try {
            templates = this.config.repos[repo[0]][repo[1]].templates;
        } catch (e) {
            message.channel.send("Dépot non trouvé").catch(console.error);
            return;
        }

        octokit.auth = {
            type:'token',
            token: this.auth.token
        };

        let promises = [],tagname;

        for (let template of templates) {
            for (let file of this.config.templates[template].files) {

                let prom = octokit.repos.getContents({
                    owner : repo[0],
                    repo : repo[1],
                    path : file.path
                }).then((result) => {

                    var content = Buffer.from(result.data.content, 'base64').toString('utf-8');
                    var version = {},data,replacedPatern;

                    switch (file.type) {
                        case "regexp":
                            version  = new RegExp(file.regexp).exec(content).groups;
                            if(type == "major"){
                                version["minor"] = 0;
                                version["patch"] = 0;
                            }else if(type == "minor"){
                                version["patch"] = 0;
                            }

                            version[type] = ""+(version[type]*1+1);

                            replacedPatern=file.regexp
                            .replace(/\(\?<major>\\d\+\)\\/,version.major)
                            .replace(/\(\?<minor>\\d\+\)\\/,version.minor)
                            .replace(/\(\?<patch>\\d\+\)/,version.patch);

                            tagname = `v${version.major}.${version.minor}.${version.patch}`;

                            content = content.replace(new RegExp(file.regexp),replacedPatern);
                            break;

                        case "json":
                            var data = JSON.parse(content);

                            version  = new RegExp(file.regexp).exec(deepFind(data,file.property)).groups;
                            if(type == "major"){
                                version["minor"] = 0;
                                version["patch"] = 0;
                            }else if(type == "minor"){
                                version["patch"] = 0;
                            }
                            version[type] = ""+(version[type]*1+1);

                            replacedPatern=file.regexp
                            .replace(/\(\?<major>\\d\+\)\\/,version.major)
                            .replace(/\(\?<minor>\\d\+\)\\/,version.minor)
                            .replace(/\(\?<patch>\\d\+\)/,version.patch);

                            tagname = `v${version.major}.${version.minor}.${version.patch}`;

                            deepFind(data,file.property,replacedPatern);

                            content = JSON.stringify( data, null, 4);

                            break;
                        default:

                    }

                    return octokit.repos.updateFile({
                        owner : repo[0],
                        repo : repo[1],
                        path : file.path ,
                        message : `Release ${tagname}`,
                        content : Buffer.from(content).toString('base64'),
                        sha:result.data.sha,
                        committer : this.bot.config.admins[message.author.id],
                        author : this.bot.config.admins[message.author.id]
                    });


                });

                promises.push(prom);

            }
        }

        Promise.all(promises).then(()=>{
            let message = args.join(" ").split("\n");

            octokit.repos.createRelease({
                owner : repo[0],
                repo : repo[1],
                tag_name: tagname,
                name:message.shift(),
                body:message.join("\n")||"",
            }).then(result => {})
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
