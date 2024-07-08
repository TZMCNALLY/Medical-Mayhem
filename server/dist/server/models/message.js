"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.Types.ObjectId;
const MessageSchema = new Schema({
    senderId: { type: ObjectId, ref: 'User' },
    text: { type: String, required: true },
    sendDate: { type: Date, default: new Date() },
}, { timestamps: true });
exports.Message = mongoose_1.default.model('Message', MessageSchema);
//# sourceMappingURL=message.js.map