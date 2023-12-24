const amqp = require('amqplib')


const runConsumer = async() => {
    try {
        const connection = await amqp.connect('amqps://ejaqrslc:FdbEYeWt40a6ggQ8zhoALDTREg1wcFUf@gerbil.rmq.cloudamqp.com/ejaqrslc')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true
        })

        channel.consume(queueName, (messages) => {
            console.log(`Received ${messages.content.toString()}`);
        }, {
            noAck: true
        })

        
    } catch (error) {
        console.log(console.error(error));
    }
}

runConsumer().catch(console.error)