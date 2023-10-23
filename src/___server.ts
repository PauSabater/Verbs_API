import { Db, MongoClient } from 'mongodb'
import { config } from './config/config'

const uri = config.mongo.url
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
}

let mongoClient: MongoClient | null = null
let database: Db | null = null

if (!process.env.NEXT_ATLAS_URI) {
    throw new Error('Please add your Mongo URI to .env.local')
}

export async function connectToDatabase() {
    try {
        if (mongoClient && database) {
            return { mongoClient, database }
        }
        if (process.env.NODE_ENV === 'development') {
            if (!global._mongoClient) {
                //@ts-ignore
                mongoClient = await new MongoClient(uri as string, options).connect()
                global._mongoClient = mongoClient
            } else {
                mongoClient = global._mongoClient
            }
        } else {
            //@ts-ignore
            mongoClient = await new MongoClient(uri as string, options).connect()
        }
        //@ts-ignore
        database = await mongoClient.db(process.env.NEXT_ATLAS_DATABASE)
        return { mongoClient, database }
    } catch (e) {
        console.error(e)
    }
}
