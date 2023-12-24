const amqp = require('amqplib')
const configURL = require("../configs/config.url")
runProducerCreateNewNoti = async(messages) => {
    try {
        const connection = await amqp.connect(configURL.development.urlRabbitMQ)

        const channel = await connection.createChannel()

        const queueName = 'create-new-noti-topic'
        await channel.assertQueue(queueName, {
            durable: true
        })

        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(messages)))
        setTimeout(() => {
            connection.close()
            // process.exit(0)
        }, 500)
        console.log(`messages sent`, messages);
    } catch (error) {
        console.log(console.error(error));
    }
}


module.exports = {runProducerCreateNewNoti}