const amqp = require('amqplib')
const messages = {
    type: "TYPE_NOTIFICATIONS.SHOP_0022",
    receivedId: "2",
    senderId: "2",
    options: {
      product_name: 'Product Name',
      shop_name: 'Shop Name'
    }
  };

const runProducer = async() => {
    try {
        const connection = await amqp.connect('amqps://ejaqrslc:FdbEYeWt40a6ggQ8zhoALDTREg1wcFUf@gerbil.rmq.cloudamqp.com/ejaqrslc')

        const channel = await connection.createChannel()

        const queueName = 'test-topic-2'
        await channel.assertQueue(queueName, {
            durable: true
        })

        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(messages)))
        // setTimeout(() => {
        //     connection.close()
        //     process.exit(0)
        // }, 500)
        console.log(`messages sent`, messages);
    } catch (error) {
        console.log(console.error(error));
    }
}

runProducer().catch(console.error)