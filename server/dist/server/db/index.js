"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') }); // ty DavidP on SO
mongoose_1.default
    .connect(process.env.URI)
    .then(() => {
    console.log('Successfully connected to ' + process.env.URI);
})
    .catch(e => {
    console.error('Connection error', e.message);
});
exports.db = mongoose_1.default.connection;
exports.default = exports.db;
//# sourceMappingURL=index.js.map