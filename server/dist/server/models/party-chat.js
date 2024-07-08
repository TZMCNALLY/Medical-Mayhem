"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyChat = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.Types.ObjectId;
const PartyChatSchema = new Schema({
    users: [{ type: ObjectId, ref: 'User' }],
    messages: [{ type: ObjectId, ref: 'Message' }],
}, { timestamps: true });
exports.PartyChat = mongoose_1.default.model('PartyChat', PartyChatSchema);
//# sourceMappingURL=party-chat.js.map