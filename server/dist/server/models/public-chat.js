"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicChat = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.Types.ObjectId;
const PublicChatSchema = new Schema({ messages: [{ type: ObjectId, ref: 'Message' }] }, { timestamps: true });
exports.PublicChat = mongoose_1.default.model('PublicChat', PublicChatSchema);
//# sourceMappingURL=public-chat.js.map