"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../startup/index"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const fs_1 = __importDefault(require("fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// CHANGE PATH WHEN I CAN GET TS-NODE WORKING - Torin
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../.env') }); // ty DavidP on SO
let mongoServer;
// Create test database to store dummy data
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    mongoose_1.default
        .connect(mongoUri)
        .then(() => {
        console.log('Successfully connected to ' + process.env.URI);
    })
        .catch(e => {
        console.error('Connection error', e.message);
    });
}));
// Tears down test database after tests finish
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoServer.stop();
    yield mongoose_1.default.disconnect();
}));
let cookie;
let fakeCookie = 'token=' + jsonwebtoken_1.default.sign({ userId: 'test_id' }, process.env.JWT_SECRET) + ';Path=/; HttpOnly; Secure; SameSite=None ';
// CHANGE PATH WHEN I CAN FIGURE OUT TS-NODE
const pfp = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../../../assets/default-avatar.txt'), 'utf8');
describe("POST /register", () => {
    it("registers a user successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).post("/auth/register").send({
            username: 'JohnSmith',
            email: "john.smith@gmail.com",
            password: 'password',
            passwordVerify: 'password'
        })
            .expect(200)
            .expect('Content-Type', /json/);
        const cookies = response.header['set-cookie'];
        expect(cookies).toBeDefined();
        expect(cookies[0]).toContain('token');
        cookie = cookies[0]; // save cookie for other requests
        expect(response.body).toEqual({
            success: true,
            username: "JohnSmith",
            email: "john.smith@gmail.com"
        });
    }));
    it("responds with status 400 & error message given password too short", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.default).post("/auth/register").send({
            username: 'JohnSmith',
            email: "john.smith@gmail.com",
            password: 'p',
            passwordVerify: 'p'
        })
            .expect(400)
            .expect('Content-Type', /json/);
    }));
    it("responds with status 400 & error message given mismatching password verification", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.default).post("/auth/register").send({
            username: 'JohnSmith',
            email: "john.smith@gmail.com",
            password: 'password',
            passwordVerify: 'passwo'
        })
            .expect(400)
            .expect('Content-Type', /json/);
    }));
    it("responds with status 400 & error message given an already-registered email", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.default).post("/auth/register").send({
            username: 'JohnSmith',
            email: "john.smith@gmail.com",
            password: 'password',
            passwordVerify: 'password'
        })
            .expect(400)
            .expect('Content-Type', /json/);
    }));
});
describe("GET /getProfile", () => {
    it("gets a default profile successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default)
            .get("/api/getProfile")
            .set('Cookie', [cookie])
            .send()
            .expect(200)
            .expect('Content-Type', /json/);
        expect(response.body).toEqual({
            bio: "",
            pfp: ""
        });
    }));
});
describe("POST /updateProfile", () => {
    it("updates a username successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.default)
            .post("/api/updateProfile")
            .set('Cookie', [cookie])
            .send({
            username: 'diff username',
            bio: '',
            pfp: ''
        })
            .expect(200);
    }));
    it("updates a bio successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.default)
            .post("/api/updateProfile")
            .set('Cookie', [cookie])
            .send({
            username: 'JohnSmith',
            bio: 'bio',
            pfp: ''
        })
            .expect(200);
    }));
    it("updates a profile picture successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.default)
            .post("/api/updateProfile")
            .set('Cookie', [cookie])
            .send({
            username: 'JohnSmith',
            bio: 'bio',
            pfp: pfp
        })
            .expect(200);
    }));
});
describe("GET /loggedIn", () => {
    it("logs in a registered user with a cookie", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).get("/auth/loggedIn")
            .set('Cookie', [cookie])
            .send()
            .expect(200)
            .expect('Content-Type', /json/);
        expect(response.body).toEqual({
            loggedIn: true,
            username: 'JohnSmith',
            email: 'john.smith@gmail.com',
            isAdmin: false
        });
    }));
    it("doesn't login in a registered user without a cookie", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).get("/auth/loggedIn")
            .send()
            .expect(401)
            .expect('Content-Type', /json/);
    }));
    it("doesn't login in a nonregistered user with a cookie", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).get("/auth/loggedIn")
            .set('Cookie', [fakeCookie])
            .send()
            .expect(404);
    }));
});
describe("POST /login", () => {
    it("logs in in a user successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).post("/auth/login").send({
            email: "john.smith@gmail.com",
            password: 'password',
        })
            .expect(200)
            .expect('Content-Type', /json/);
        const cookies = response.header['set-cookie'];
        expect(cookies).toBeDefined();
        expect(cookies[0]).toContain('token');
        expect(response.body).toEqual({
            success: true,
            username: "JohnSmith",
            email: "john.smith@gmail.com"
        });
    }));
    it("logs in in a user successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).post("/auth/login").send({
            email: "john.smith@gmail.com",
            password: 'password',
        })
            .expect(200)
            .expect('Content-Type', /json/);
        const cookies = response.header['set-cookie'];
        expect(cookies).toBeDefined();
        expect(cookies[0]).toContain('token');
        expect(response.body).toEqual({
            success: true,
            username: "JohnSmith",
            email: "john.smith@gmail.com"
        });
    }));
    it("doesn't log in with a wrong email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).post("/auth/login").send({
            email: "wrong email",
            password: 'password',
        })
            .expect(401);
    }));
    it("doesn't log in with a wrong password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).post("/auth/login").send({
            email: "john.smith@gmail.com",
            password: 'pasdffdas',
        })
            .expect(401);
    }));
});
describe("POST /deleteUser", () => {
    it("deletes a user successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).post("/auth/deleteUser")
            .set('Cookie', [cookie])
            .send()
            .expect(200);
    }));
    it("deletes a nonexistent user unsuccessfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).post("/auth/deleteUser")
            .set('Cookie', [fakeCookie])
            .send()
            .expect(404);
    }));
});
//# sourceMappingURL=auth.test.js.map