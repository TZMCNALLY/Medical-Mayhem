"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.Types.ObjectId;
const CommentSchema = new Schema({
    senderId: { type: ObjectId, ref: 'User' },
    senderUsername: { type: String, required: true },
    text: { type: String, required: true },
    sendDate: { type: Date, default: new Date() },
}, { timestamps: true });
exports.Comment = mongoose_1.default.model('Comment', CommentSchema);
//# sourceMappingURL=comment.js.map