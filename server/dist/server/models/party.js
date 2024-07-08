"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Party = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.Types.ObjectId;
const PartySchema = new Schema({
    users: [{ type: ObjectId, ref: 'User' }],
    partyLeader: { type: ObjectId, ref: 'User' },
}, { timestamps: true });
exports.Party = mongoose_1.default.model('Party', PartySchema);
//# sourceMappingURL=party.js.map