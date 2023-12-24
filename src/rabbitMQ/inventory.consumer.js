const amqp = require('amqplib')
const InventoryService = require('../services/inventory.service')
const configURL = require("../configs/config.url")
const runThreadInventoryConsumer = async() => {
    try {
        
        const connection = await amqp.connect(configURL.development.urlRabbitMQ)
        const channel = await connection.createChannel()

        const queueName = 'thread-inventory'
        await channel.assertQueue(queueName, {
            durable: true
        })

        channel.consume(queueName, async (messages) => {
            console.log("as", messages);
              const mess = messages.content.toString()
              const jsonObject = JSON.parse(mess);
              console.log("mess", jsonObject);
             await InventoryService.updateInventoryQuantities(jsonObject)
                // await AccessService.removeFollow(shopId, userId)
        }, {
            noAck: true
        })

        
    } catch (error) {
        console.log(console.error(error));
    }
}
// runThreadInventoryConsumer().catch(console.error)
module.exports = {runThreadInventoryConsumer}