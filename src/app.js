require('dotenv').config()
const express = require("express")
const morgan = require('morgan')
const {default: helmet} = require('helmet')
const compression = require('compression')
const cors = require("cors")
const {runFollowShopConsumer, runUnFollowShopConsumer} = require('./rabbitMQ/followShop.consumer')
const {runThreadInventoryConsumer} = require("./rabbitMQ/inventory.consumer")
const setupCronJob = require('.././src/services/cronjob');
const app = express()

app.use(cors({
    origin: "*"
}))

//init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//init db
require('./dbs/init.mongodb')
// const {checkOverload} = require('./helpers/check.connect')
// checkOverload()

//init routes
 app.use('/', require('./routes'))

//handling error

app.use((req,res,next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

// setupCronJob()
//rabbitMQ
runFollowShopConsumer().catch(console.error)
runUnFollowShopConsumer().catch(console.error)
runThreadInventoryConsumer().catch(console.error)


app.use((error,req,res,next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server Error'
    })
    
})


module.exports = app