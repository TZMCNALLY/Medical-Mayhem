"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Avatar = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.Types.ObjectId;
const AvatarSchema = new Schema({
    avatarSprite: { type: String, default: "" },
    avatarName: { type: String, default: "" },
    speed: { type: Number, default: 0 },
    strength: { type: Number, default: 0 },
    defense: { type: Number, default: 0 },
    favoredMinigame: { type: String, default: "" },
    author: { type: String, default: "" },
    comments: [{ type: ObjectId, ref: 'Message' }],
    isPublic: { type: Boolean, default: true },
}, { timestamps: true });
exports.Avatar = mongoose_1.default.model('Avatar', AvatarSchema);
//# sourceMappingURL=avatar.js.map