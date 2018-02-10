

class AbstractCommand {

    constructor(config, bot){
        this.config = ( config ===true ? {} : config );
        this.bot = bot;
    }

}

module.exports = AbstractCommand;
