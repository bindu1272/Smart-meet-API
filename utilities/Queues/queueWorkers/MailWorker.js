const BaseWorker = require('./BaseWorker');
const Mail = require('../../mail/Mail');


class MailWorker extends  BaseWorker {

    constructor() {
        super();
        this.queue = "hello";
        
    }

    async init(msg) {
        const data = JSON.parse(msg);
            console.log("data==>",data)
        const mail = new Mail();
        return await mail.send(data);
    }

}

new MailWorker();

