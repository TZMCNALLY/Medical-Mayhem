"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConnection = exports.queue = void 0;
const socketEvents_1 = __importDefault(require("../../client/src/constants/socketEvents"));
const crypto_1 = require("crypto");
const index_1 = require("./index");
class SocketInfo {
    constructor(username = '') {
        this.username = username;
        this.gameRoom = '';
    }
}
// The queue that will hold all players currently queueing for a game by username
exports.queue = [];
// Maps socket ids to a set of rooms
const socketInfos = new Map();
// TODO: ADD NAMESPACES SUCH AS /game, /message, etc.
function handleConnection(socket) {
    // Maps the newly connected socket to an object holding its rooms
    socketInfos.set(socket.id, new SocketInfo());
    socket.on('disconnect', () => {
        if (exports.queue.includes(socket))
            exports.queue.splice(exports.queue.indexOf(socket), 1);
        socketInfos.delete(socket.id);
    });
    socket.on(socketEvents_1.default.SET_USERNAME, (data) => {
        socketInfos.get(socket.id).username = data;
        console.log(data);
    });
    socket.on(socketEvents_1.default.QUEUE_UP, (data) => {
        if (exports.queue.length >= 3) {
            // Generate random room number and join it
            let room = (0, crypto_1.randomBytes)(8).toString('hex');
            socket.join(room);
            // Update room data structure
            const currSocketInfo = socketInfos.get(socket.id);
            currSocketInfo.username = data;
            currSocketInfo.gameRoom = room;
            const players = [];
            players.push(currSocketInfo.username);
            // Pop players from queue and add them to the room
            for (let i = 0; i < 3; i++) {
                const teammateSocket = exports.queue.shift();
                teammateSocket.join(room);
                const currTeammateSocketInfo = socketInfos.get(teammateSocket.id);
                currTeammateSocketInfo.gameRoom = room;
                players.push(currTeammateSocketInfo.username);
            }
            index_1.io.to(room).emit(socketEvents_1.default.MATCH_FOUND, {
                players: players
            });
        }
        else {
            exports.queue.push(socket);
        }
    });
    socket.on(socketEvents_1.default.LEAVE_QUEUE, (data) => {
        if (exports.queue.includes(socket))
            exports.queue.splice(exports.queue.indexOf(socket), 1);
        console.log(exports.queue);
    });
    // GAMEPLAY
    // data is a player username, and a vec
    socket.on(socketEvents_1.default.PLAYER_MOVED, (data) => {
        index_1.io.to(socketInfos.get(socket.id).gameRoom).emit(socketEvents_1.default.PLAYER_MOVED, data);
    });
    // data is a player username
    socket.on(socketEvents_1.default.STOP_FOLLOW, (data) => {
        index_1.io.to(socketInfos.get(socket.id).gameRoom).emit(socketEvents_1.default.STOP_FOLLOW, data);
    });
    // data is a player username and a patient
    socket.on(socketEvents_1.default.TREAT_PATIENT, (data) => {
        index_1.io.to(socketInfos.get(socket.id).gameRoom).emit(socketEvents_1.default.TREAT_PATIENT, data);
    });
    // data is a patient id
    socket.on(socketEvents_1.default.SPAWN_PATIENT, (data) => {
        index_1.io.to(socketInfos.get(socket.id).gameRoom).emit(socketEvents_1.default.SPAWN_PATIENT, data);
    });
}
exports.handleConnection = handleConnection;
//# sourceMappingURL=socketHandlers.js.map