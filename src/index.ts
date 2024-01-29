import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
import { config } from './config/config'
import { Logging } from './library/Logging'
import verbRoutes from './routes/Verb'
import userRoutes from './routes/User'
const cors = require('cors')
const cookieParser = require('cookie-parser')

const router = express()

/** Connect to Mongo */
mongoose
    .connect(config.mongo.url, {
        dbName: 'konjug',
        retryWrites: true,
        w: 'majority'
    })
    .then(() => {
        Logging.info('Mongo connected successfully.')
        StartServer()
    })
    .catch((error) => {
        Logging.error(error)
    })

/** Only Start Server if Mongoose Connects */
const StartServer = () => {
    /** Log the request */
    router.use((req, res, next) => {
        /** Log the req */
        Logging.info(`Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`)

        res.on('finish', () => {
            /** Log the res */
            Logging.info(`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`)
        })

        next()
    })

    router.use(express.urlencoded({ extended: true }))
    router.use(express.json())
    router.use(cookieParser())

    /** Rules of our API */
    router.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
        // @ts-ignore
        res.header('Access-Control-Allow-Credentials', true)
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        // Pass to next layer of middleware
        if (req.method === 'OPTIONS') res.sendStatus(200)
        else next()

        // if (req.method == 'OPTIONS') {
        //     return res.status(200).json({})
        // }
    })

    /** Routes */
    router.use('/verbs', verbRoutes)
    router.use('/users', userRoutes)

    /** CORS */
    router.use(
        cors({
            credentials: true,
            origin: ['http://localhost:3000']
        })
    )

    router.get('/', (req, res, next) => {
        return res.send('Express Typescript on Vercel')
    })

    /** Healthcheck */
    router.get('/ping', (req, res, next) => res.status(200).json({ hello: 'Hello from konjug' }))

    /** Error handling */
    router.use((req, res, next) => {
        const error = new Error('Route not found')

        Logging.error(error)

        res.status(404).json({
            message: error.message
        })
    })

    http.createServer(router).listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}`))
}
