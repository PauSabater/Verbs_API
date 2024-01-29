import dotenv from 'dotenv'

dotenv.config()

const NEXT_MONGO_USERNAME = process.env.NEXT_MONGO_USERNAME
const NEXT_MONGO_PASSWORD = process.env.NEXT_MONGO_PASSWORD
const MONGO_URL = `mongodb+srv://${NEXT_MONGO_USERNAME}:${NEXT_MONGO_PASSWORD}@verbs.xg7zoxw.mongodb.net/`

const NEXT_SERVER_PORT = process.env.NEXT_SERVER_PORT ? Number(process.env.NEXT_SERVER_PORT) : 1337

export const config = {
    mongo: {
        url: MONGO_URL
    },
    server: {
        port: NEXT_SERVER_PORT
    }
}
