var amqp = require('amqplib/callback_api');

class BaseWorker {

    constructor(){
        this.channel = this.getChannel();
        this.getQueueMessage(this.init);
    }

    getChannel() {

        return new Promise((resolve, reject) => {

            amqp.connect('amqp://localhost', function (error0, connection) {

                if (error0) {
                    throw error0;
                }
                connection.createChannel( (error1, channel) =>  {
                    if (error1) {
                        throw error1;
                    }
                    resolve(channel);
                })
            });
        });

    }

    async getQueueMessage  (cb) {
        this.channel = await this.channel;

        this.channel.assertQueue(this.queue, {
            durable: false
        });
        

        return this.channel.consume(this.queue, async (msg) =>  {
            await cb(msg.content.toString());
        }, {
            noAck: true
        });
    }

}

module.exports = BaseWorker;