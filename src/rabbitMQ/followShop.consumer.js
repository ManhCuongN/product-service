const amqp = require('amqplib')
const AccessService = require('../services/access.service')
const  axios  = require('axios')
const configURL = require("../configs/config.url")

const runFollowShopConsumer = async() => {
    try {
        // amqp://guest:guest@localhost
        const connection = await amqp.connect(configURL.development.urlRabbitMQ)
        const channel = await connection.createChannel()

        const queueName = 'follow-shop-topic'
        await channel.assertQueue(queueName, {
            durable: true
        })

        channel.consume(queueName, async (messages) => {
              const mess = messages.content.toString()
              const jsonObject = JSON.parse(mess);
              const {shopId, userId} = jsonObject
              console.log("mess", userId, shopId);
              const data = {
                senderId: userId.toString(),
                receiverId: shopId
              }
              
                await AccessService.insertFollower(shopId, userId)
                await axios.post(`https://system-service-production.up.railway.app//api/s3/chat/create`,data)
        }, {
            noAck: true
        })

        
    } catch (error) {
        console.log(console.error(error));
    }
}

const runUnFollowShopConsumer = async() => {
    try {
        const connection = await amqp.connect(configURL.development.urlRabbitMQ)
        const channel = await connection.createChannel()

        const queueName = 'un-follow-shop-topic'
        await channel.assertQueue(queueName, {
            durable: true
        })

        channel.consume(queueName, async (messages) => {
              const mess = messages.content.toString()
              const jsonObject = JSON.parse(mess);
              const {shopId, userId} = jsonObject
              console.log("mess", shopId, userId);
              const data = {
                senderId: userId.toString(),
                receiverId: shopId
              }
                await AccessService.removeFollow(shopId, userId)
                await axios.post(`https://system-service-production.up.railway.app//api/s3/chat/delete`,data)

        }, {
            noAck: true
        })

        
    } catch (error) {
        console.log(console.error(error));
    }
}
module.exports = {runFollowShopConsumer, runUnFollowShopConsumer}