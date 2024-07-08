// Creates the express server. Don't run the server from here though!
// Run the server through ts-node server.ts. The reason for this separation
// was so that running the tests and running the live server wouldn't conflict
// with one another.

// THESE ARE NODE APIs WE WISH TO USE
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv';
import path from 'path'
import authRouter from '../routes/auth-router'
import mainRouter from '../routes/main-router'
import socialRouter from '../routes/social-router'
import partyRouter from '../routes/party-router'
import avatarRouter from '../routes/avatar-router'
import messageRouter from '../routes/message-router'
import http from 'http'
import { Server, Socket } from 'socket.io'
import { handleConnection } from './socketHandlers';

dotenv.config({ path: path.resolve(__dirname, '../.env')}); // ty DavidP on SO

// CREATE OUR SERVER
export const app = express()

// SETUP THE MIDDLEWARE
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: [process.env.NODE_ENV === 'production' ? 'https://medical-mayhem-c0832c3f548e.herokuapp.com' : 
        'http://localhost:3000' ],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// SETUP OUR OWN ROUTERS AS MIDDLEWARE
app.use('/auth', authRouter)
app.use('/api', mainRouter)
app.use('/api', socialRouter)
app.use('/api', partyRouter)
app.use('/api', avatarRouter)
app.use('/api', messageRouter)

// Creates the HTTP server with Express handling requests and responses
export const server = http.createServer(app)

// Wrapper that adds socket functionality
export const io = new Server(server, {
    cors: {
        origin: [process.env.NODE_ENV === 'production' ? 'https://medical-mayhem-c0832c3f548e.herokuapp.com' : 
            'http://localhost:3000' ],
        methods: ["GET", "POST"],
    }
})

io.on('connection', handleConnection)

// If the app is in Heroku, use and serve the generated build, and route requests to index.html
if (process.env.NODE_ENV === 'production') {
    app.use(express.static( 'client/build' ))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

export default server;