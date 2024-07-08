"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.Types.ObjectId;
const UserSchema = new Schema({
    username: { type: String, required: true },
    bio: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    chatVisibility: { type: Boolean, default: true },
    friendsIds: [{ type: ObjectId, ref: 'User' }],
    blockedIds: [{ type: ObjectId, ref: 'User' }],
    recentPlayers: [{ type: ObjectId, ref: 'User' }],
    gamesPlayed: { type: Number, default: 0 },
    gamesWon: { type: Number, default: 0 },
    highScore: { type: Number, default: 0 },
    patientsSaved: { type: Number, default: 0 },
    winPercent: { type: Number, default: 0 },
    // achievements : [Achievement],
    // featuredAchievements : [Achievement],
    onlineStatus: { type: Boolean, default: true },
    dateSinceOnline: { type: Date, default: new Date() },
    dateRegistered: { type: Date, default: new Date() },
    isAdmin: { type: Boolean, default: false },
    // Settings
    masterVolume: { type: Number, required: true, default: 100 },
    musicVolume: { type: Number, required: true, default: 100 },
    sfxVolume: { type: Number, required: true, default: 100 },
    keybinds: {
        UP: { type: String, required: true, default: 'W' },
        LEFT: { type: String, required: true, default: 'A' },
        DOWN: { type: String, required: true, default: 'S' },
        RIGHT: { type: String, required: true, default: 'D' },
        INTERACT: { type: String, required: true, default: 'E' }
    },
    appearAsOffline: { type: Boolean, default: false },
    toggleChat: { type: Boolean, default: true },
    toggleParty: { type: Boolean, default: true },
    // Pertaining to sprites and gameplay
    avatars: [{ type: ObjectId, ref: 'Avatar' }],
    avatarSprite: { type: String, default: "" },
    avatarName: { type: String, default: "" },
    speed: { type: Number, default: 0 },
    strength: { type: Number, default: 0 },
    defense: { type: Number, default: 0 },
    favoredMinigame: { type: String, default: "" },
    isPublic: { type: Boolean, default: false },
}, { timestamps: true });
exports.User = mongoose_1.default.model('User', UserSchema);
//# sourceMappingURL=user.js.map