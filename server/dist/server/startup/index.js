"use strict";
// Creates the express server. Don't run the server from here though!
// Run the server through ts-node server.ts. The reason for this separation
// was so that running the tests and running the live server wouldn't conflict
// with one another.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = exports.app = void 0;
// THESE ARE NODE APIs WE WISH TO USE
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const auth_router_1 = __importDefault(require("../routes/auth-router"));
const main_router_1 = __importDefault(require("../routes/main-router"));
const social_router_1 = __importDefault(require("../routes/social-router"));
const party_router_1 = __importDefault(require("../routes/party-router"));
const avatar_router_1 = __importDefault(require("../routes/avatar-router"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const socketHandlers_1 = require("./socketHandlers");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') }); // ty DavidP on SO
// CREATE OUR SERVER
exports.app = (0, express_1.default)();
// SETUP THE MIDDLEWARE
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((0, cors_1.default)({
    origin: [process.env.NODE_ENV === 'production' ? 'https://medical-mayhem-c0832c3f548e.herokuapp.com' :
            'http://localhost:3000'],
    credentials: true
}));
exports.app.use(express_1.default.json());
exports.app.use((0, cookie_parser_1.default)());
// SETUP OUR OWN ROUTERS AS MIDDLEWARE
exports.app.use('/auth', auth_router_1.default);
exports.app.use('/api', main_router_1.default);
exports.app.use('/api', social_router_1.default);
exports.app.use('/api', party_router_1.default);
exports.app.use('/api', avatar_router_1.default);
// Creates the HTTP server with Express handling requests and responses
exports.server = http_1.default.createServer(exports.app);
// Wrapper that adds socket functionality
exports.io = new socket_io_1.Server(exports.server, {
    cors: {
        origin: [process.env.NODE_ENV === 'production' ? 'https://medical-mayhem-c0832c3f548e.herokuapp.com' :
                'http://localhost:3000'],
        methods: ["GET", "POST"],
    }
});
exports.io.on('connection', socketHandlers_1.handleConnection);
// If the app is in Heroku, use and serve the generated build, and route requests to index.html
if (process.env.NODE_ENV === 'production') {
    exports.app.use(express_1.default.static('client/build'));
    exports.app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, 'client', 'build', 'index.html'));
    });
}
exports.default = exports.server;
//# sourceMappingURL=index.js.map