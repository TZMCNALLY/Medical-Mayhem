import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env')}); // ty DavidP on SO

mongoose
    .connect(process.env.URI as string)
    .then(() => {
        console.log('Successfully connected to ' + process.env.URI)
    })
    .catch(e => {
        console.error('Connection error', e.message)
    })

export const db = mongoose.connection
export default db