

class AbstractCommand {

    constructor(config,name, bot){
        this.config = ( config ===true ? {} : config );
        this.name = name;
        this.bot = bot;
        this.initialise();
    }

    initialise(){
        let me = this;
        me.initialised = new Promise(function(resolve, reject) {
            resolve(me);
        });
    }

}

module.exports = AbstractCommand;
