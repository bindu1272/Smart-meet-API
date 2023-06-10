var amqp = require('amqplib/callback_api');

class sendQueue {

    constructor() {
        this.channel = this.getChannel();
    }

    getChannel() {

        return new Promise((resolve, reject) => {

            amqp.connect('amqp://localhost', function (error0, connection) {

                if (error0) {
                    throw error0;
                }
                connection.createChannel(function (error1, channel) {
                    if (error1) {
                        throw error1;
                    }
                    resolve(channel);
                })
            });
        });

    }

    async send(queue = "hello", msg = 'Hello World!') {

        let channel = await this.channel;

        channel.assertQueue(queue, {
            durable: false
        });

        channel.sendToQueue(queue, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);


    }

}

modules.export = sendQueue;


