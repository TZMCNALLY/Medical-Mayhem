"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = void 0;
const _1 = __importDefault(require("."));
const db_1 = __importDefault(require("../db"));
// Runs the server
exports.PORT = process.env.PORT || 4000;
// INITIALIZE OUR DATABASE OBJECT
db_1.default.on('error', console.error.bind(console, 'MongoDB connection error:'));
// PUT THE SERVER IN LISTENING MODE
_1.default.listen(exports.PORT, () => console.log(`Server running on port ${exports.PORT}`));
//# sourceMappingURL=server.js.map