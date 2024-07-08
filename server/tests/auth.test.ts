import request from 'supertest';
import app from '../startup/index';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import path from 'path'
import { MongoMemoryServer } from 'mongodb-memory-server'
import Cookies from 'js-cookie'
import fs from 'fs'
import jwt from 'jsonwebtoken'

// CHANGE PATH WHEN I CAN GET TS-NODE WORKING - Torin
dotenv.config({ path: path.resolve(__dirname, '../../../.env')}); // ty DavidP on SO

let mongoServer: MongoMemoryServer; 

// Create test database to store dummy data
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri();

    mongoose
        .connect(mongoUri)
        .then(() => {
            console.log('Successfully connected to ' + process.env.URI)
        })
        .catch(e => {
            console.error('Connection error', e.message)
        })
})

// Tears down test database after tests finish
afterAll(async () => {
    await mongoServer.stop()
    await mongoose.disconnect()
})

let cookie: string
let fakeCookie = 'token=' + jwt.sign({userId: 'test_id'}, process.env.JWT_SECRET) + ';Path=/; HttpOnly; Secure; SameSite=None '

// CHANGE PATH WHEN I CAN FIGURE OUT TS-NODE
const pfp = fs.readFileSync(path.resolve(__dirname, '../../../assets/default-avatar.txt'), 'utf8')

describe("POST /register", () => {

    it("registers a user successfully", async () => {
        const response = await request(app).post("/auth/register").send({
            username: 'JohnSmith',
            email: "john.smith@gmail.com",
            password: 'password',
            passwordVerify: 'password'
        })
        .expect(200)
        .expect('Content-Type', /json/)

        const cookies = response.header['set-cookie']
        expect(cookies).toBeDefined()
        expect(cookies[0]).toContain('token')

        cookie = cookies[0] // save cookie for other requests

        expect(response.body).toEqual({
            success: true,
            username: "JohnSmith",
            email: "john.smith@gmail.com"              
        })
    })

    it("responds with status 400 & error message given password too short", async () => {
        await request(app).post("/auth/register").send({
            username: 'JohnSmith',
            email: "john.smith@gmail.com",
            password: 'p',
            passwordVerify: 'p'
        })
        .expect(400)
        .expect('Content-Type', /json/)
    })

    it("responds with status 400 & error message given mismatching password verification", async () => {
        await request(app).post("/auth/register").send({
            username: 'JohnSmith',
            email: "john.smith@gmail.com",
            password: 'password',
            passwordVerify: 'passwo'
        })
        .expect(400)
        .expect('Content-Type', /json/)
    })

    it("responds with status 400 & error message given an already-registered email", async () => {
        await request(app).post("/auth/register").send({
            username: 'JohnSmith',
            email: "john.smith@gmail.com",
            password: 'password',
            passwordVerify: 'password'
        })
        .expect(400)
        .expect('Content-Type', /json/)
    })
})

describe("GET /getProfile", () => {

    it("gets a default profile successfully", async () => {
        const response = await request(app)
            .get("/api/getProfile")
            .set('Cookie', [cookie])
            .send()
            .expect(200)
            .expect('Content-Type', /json/)
        
            expect(response.body).toEqual({
                bio: "",
                pfp: "" 
            })             
    })
})

describe("POST /updateProfile", () => {

    it("updates a username successfully", async () => {
        await request(app)
            .post("/api/updateProfile")
            .set('Cookie', [cookie])
            .send({
                username: 'diff username',
                bio: '',
                pfp: ''
            })
            .expect(200)
    })

    it("updates a bio successfully", async () => {
        await request(app)
            .post("/api/updateProfile")
            .set('Cookie', [cookie])
            .send({
                username: 'JohnSmith',
                bio: 'bio',
                pfp: ''
            })
            .expect(200)
    })

    it("updates a profile picture successfully", async () => {
        await request(app)
            .post("/api/updateProfile")
            .set('Cookie', [cookie])
            .send({
                username: 'JohnSmith',
                bio: 'bio',
                pfp: pfp
            })
            .expect(200)
    })
})

describe("GET /loggedIn", () => {
    it("logs in a registered user with a cookie", async () => {
        const response = await request(app).get("/auth/loggedIn")
        .set('Cookie', [cookie])
        .send()
        .expect(200)
        .expect('Content-Type', /json/)
    
        expect(response.body).toEqual({
            loggedIn: true,
            username: 'JohnSmith',
            email: 'john.smith@gmail.com',
            isAdmin: false
        })         
    })

    it("doesn't login in a registered user without a cookie", async () => {
        const response = await request(app).get("/auth/loggedIn")
        .send()
        .expect(401)
        .expect('Content-Type', /json/)   
    })

    it("doesn't login in a nonregistered user with a cookie", async () => {
        const response = await request(app).get("/auth/loggedIn")
        .set('Cookie', [fakeCookie])
        .send()
        .expect(404)
    })
})

describe("POST /login", () => {

    it("logs in in a user successfully", async () => {
        const response = await request(app).post("/auth/login").send({
            email: "john.smith@gmail.com",
            password: 'password',
        })
        .expect(200)
        .expect('Content-Type', /json/)

        const cookies = response.header['set-cookie']
        expect(cookies).toBeDefined()
        expect(cookies[0]).toContain('token')

        expect(response.body).toEqual({
            success: true,
            username: "JohnSmith",
            email: "john.smith@gmail.com"              
        })
    })

    it("logs in in a user successfully", async () => {
        const response = await request(app).post("/auth/login").send({
            email: "john.smith@gmail.com",
            password: 'password',
        })
        .expect(200)
        .expect('Content-Type', /json/)

        const cookies = response.header['set-cookie']
        expect(cookies).toBeDefined()
        expect(cookies[0]).toContain('token')

        expect(response.body).toEqual({
            success: true,
            username: "JohnSmith",
            email: "john.smith@gmail.com"              
        })
    })

    it("doesn't log in with a wrong email", async () => {
        const response = await request(app).post("/auth/login").send({
            email: "wrong email",
            password: 'password',
        })
        .expect(401)
    })

    it("doesn't log in with a wrong password", async () => {
        const response = await request(app).post("/auth/login").send({
            email: "john.smith@gmail.com",
            password: 'pasdffdas',
        })
        .expect(401)
    })
})

describe("POST /deleteUser", () => {
    
    it("deletes a user successfully", async () => {
        const response = await request(app).post("/auth/deleteUser")
        .set('Cookie', [cookie])
        .send()
        .expect(200)
    })

    it("deletes a nonexistent user unsuccessfully", async () => {
        const response = await request(app).post("/auth/deleteUser")
        .set('Cookie', [fakeCookie])
        .send()
        .expect(404)
    })
})