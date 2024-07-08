"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerController = exports.blockPlayer = exports.getRelationToUser = exports.viewOnlinePlayers = exports.updateToggles = exports.updateKeybinds = exports.updateAudioSettings = exports.getSettings = exports.updateAvatar = exports.getAvatar = exports.getRecentPlayers = exports.updateProfile = exports.getProfile = void 0;
const user_1 = require("../models/user");
const friend_request_1 = require("../models/friend-request");
//TODO: might have to add additional middleware that check if the user still exists
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getProfile");
    try {
        console.log(req.userId);
        const existingUser = yield user_1.User.findById(req.userId);
        console.log("existingUser: " + existingUser);
        if (!existingUser) {
            return res
                .status(400)
                .json({
                errorMessage: "User does not exist."
            });
        }
        return res
            .status(200)
            .json({
            bio: existingUser.bio,
            pfp: existingUser.profilePicture
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, bio, pfp } = req.body;
        let updatedUser;
        if (pfp) {
            updatedUser = yield user_1.User.updateOne({ _id: req.userId }, { $set: { username: username, bio: bio, profilePicture: pfp } });
        }
        else {
            updatedUser = yield user_1.User.updateOne({ _id: req.userId }, { $set: { username: username, bio: bio } });
        }
        if (!updatedUser) {
            return res
                .status(400)
                .json({
                errorMessage: "User cannot be updated."
            });
        }
        return res.status(200).send();
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.updateProfile = updateProfile;
const getRecentPlayers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = yield user_1.User.findById(req.userId);
        if (!currentUser)
            return res.status(400).json({ errorMessage: 'Current user not found.' });
        const recentPlayers = [];
        yield Promise.all(currentUser.recentPlayers.map((recentPlayerId) => __awaiter(void 0, void 0, void 0, function* () {
            const recentPlayer = yield user_1.User.findById(recentPlayerId);
            if (recentPlayer) {
                recentPlayers.push({
                    username: recentPlayer.username,
                    profilePicture: recentPlayer.profilePicture,
                    onlineStatus: recentPlayer.onlineStatus
                });
            }
        })));
        return res.status(200).json({ players: recentPlayers });
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.getRecentPlayers = getRecentPlayers;
const getAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getAvatar");
    try {
        const existingUser = yield user_1.User.findById(req.userId);
        if (!existingUser) {
            return res
                .status(400)
                .json({
                errorMessage: "User does not exist."
            });
        }
        return res
            .status(200)
            .json({
            pic: existingUser.avatarSprite,
            name: existingUser.avatarName,
            speed: existingUser.speed,
            strength: existingUser.strength,
            defense: existingUser.defense,
            favoredMinigame: existingUser.favoredMinigame,
            isPublic: existingUser.isPublic,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.getAvatar = getAvatar;
const updateAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pic, name, speed, strength, defense, favoredMinigame, isPublic } = req.body;
        let updatedUser;
        if (pic) {
            updatedUser = yield user_1.User.updateOne({ _id: req.userId }, { $set: { avatarSprite: pic, avatarName: name, speed: speed, strength: strength, defense: defense, favoredMinigame: favoredMinigame, isPublic: isPublic } });
        }
        else {
            updatedUser = yield user_1.User.updateOne({ _id: req.userId }, { $set: { avatarName: name, speed: speed, strength: strength, defense: defense, favoredMinigame: favoredMinigame, isPublic: isPublic } });
        }
        console.log("updatedUser: " + updatedUser);
        if (!updatedUser) {
            return res
                .status(400)
                .json({
                errorMessage: "User cannot be updated."
            });
        }
        return res.status(200).send();
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.updateAvatar = updateAvatar;
const getSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.User.findOne({ _id: req.userId }, { masterVolume: 1, musicVolume: 1, sfxVolume: 1, keybinds: 1, appearAsOffline: 1, toggleChat: 1, toggleParty: 1 });
        if (!user)
            return res.status(400).send({ errorMessage: 'User not found.' });
        return res.status(200).json({
            masterVolume: user.masterVolume,
            musicVolume: user.musicVolume,
            sfxVolume: user.sfxVolume,
            keybinds: user.keybinds,
            toggles: {
                privateProfile: user.appearAsOffline,
                messages: user.toggleChat,
                party: user.toggleParty,
            }
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.getSettings = getSettings;
const updateAudioSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { masterVolume, musicVolume, sfxVolume } = req.body;
        yield user_1.User.updateOne({ _id: req.userId }, { $set: { masterVolume: masterVolume, musicVolume: musicVolume, sfxVolume: sfxVolume } });
        res.status(200).send();
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.updateAudioSettings = updateAudioSettings;
const updateKeybinds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const { UP, LEFT, DOWN, RIGHT, INTERACT } = req.body;
        const currUser = yield user_1.User.findOne({ _id: req.userId });
        if (!currUser)
            return res.status(400).send('User not found.');
        const newKeybinds = {
            UP: UP || ((_a = currUser.keybinds) === null || _a === void 0 ? void 0 : _a.UP),
            LEFT: LEFT || ((_b = currUser.keybinds) === null || _b === void 0 ? void 0 : _b.LEFT),
            DOWN: DOWN || ((_c = currUser.keybinds) === null || _c === void 0 ? void 0 : _c.DOWN),
            RIGHT: RIGHT || ((_d = currUser.keybinds) === null || _d === void 0 ? void 0 : _d.RIGHT),
            INTERACT: INTERACT || ((_e = currUser.keybinds) === null || _e === void 0 ? void 0 : _e.INTERACT),
        };
        yield user_1.User.updateOne({ _id: req.userId }, { $set: { keybinds: newKeybinds } });
        res.status(200).send();
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.updateKeybinds = updateKeybinds;
const updateToggles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { privateProfile, toggleChat, toggleParty } = req.body;
        yield user_1.User.updateOne({ _id: req.userId }, { $set: { appearAsOffline: privateProfile, toggleChat: toggleChat, toggleParty: toggleParty } });
        res.status(200).send();
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.updateToggles = updateToggles;
const viewOnlinePlayers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Sorts by username from A-Z. Collation makes it case-insensitive
        const currUser = yield user_1.User.findOne({ _id: req.userId }, { username: 1 });
        if (!currUser)
            return res.status(400).json({ errorMessage: 'User not found.' });
        const onlinePlayersTemp = yield user_1.User.find({ $and: [{ onlineStatus: true }, { username: { $ne: currUser.username } }] }, { username: 1 }).collation({ locale: 'en', strength: 2 }).sort({ username: 1 });
        const onlinePlayers = [];
        yield Promise.all(onlinePlayersTemp.map((onlinePlayerId) => __awaiter(void 0, void 0, void 0, function* () {
            const onlinePlayer = yield user_1.User.findById(onlinePlayerId);
            if (onlinePlayer) {
                onlinePlayers.push({
                    username: onlinePlayer.username,
                    profilePicture: onlinePlayer.profilePicture,
                    onlineStatus: onlinePlayer.onlineStatus
                });
            }
        })));
        return res.status(200).json({ players: onlinePlayers });
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.viewOnlinePlayers = viewOnlinePlayers;
const getRelationToUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currUser = yield user_1.User.findOne({ _id: req.userId }, { username: 1, friendsIds: 1, blockedIds: 1 });
        const targetUser = yield user_1.User.findOne({ username: req.body.targetUsername }, { _id: 1, friendsIds: 1, blockedIds: 1 });
        if (!currUser || !targetUser)
            return res.status(400).json({ errorMessage: 'User not found.' });
        const targetId = targetUser._id;
        const reqSent = yield friend_request_1.FriendRequest.findOne({ sender: currUser._id, receiver: targetId });
        const reqRecv = yield friend_request_1.FriendRequest.findOne({ receiver: currUser._id, sender: targetId });
        if (currUser.friendsIds.includes(targetId) && targetUser.friendsIds.includes(currUser._id))
            res.status(200).send('FRIENDS');
        else if (reqSent)
            res.status(200).send('SENT');
        else if (reqRecv)
            res.status(200).send('RECEIVED');
        else if (currUser.blockedIds.includes(targetId))
            res.status(200).send('BLOCKED');
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.getRelationToUser = getRelationToUser;
const blockPlayer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currUser = yield user_1.User.findOne({ _id: req.userId }, { username: 1, friendsIds: 1, blockedIds: 1 });
        const targetUser = yield user_1.User.findOne({ username: req.body.targetUsername }, { _id: 1, friendsIds: 1, blockedIds: 1 });
        if (!currUser || !targetUser)
            return res.status(400).json({ errorMessage: 'User not found.' });
        const targetId = targetUser._id;
        // If current and target user are friends, remove from each other's friend lists
        if (currUser.friendsIds.includes(targetId)) {
            let ind = currUser.friendsIds.indexOf(targetId);
            if (ind > -1)
                currUser.friendsIds.splice(ind, 1);
            ind = targetUser.friendsIds.indexOf(currUser._id);
            if (ind > -1)
                targetUser.friendsIds.splice(ind, 1);
        }
        // If current user sent a friend request to target user (or vice versa), remove friend request
        const reqSent = yield friend_request_1.FriendRequest.findOne({ sender: currUser._id, receiver: targetId });
        const reqRecv = yield friend_request_1.FriendRequest.findOne({ receiver: currUser._id, sender: targetId });
        if (reqSent)
            yield friend_request_1.FriendRequest.deleteOne({ _id: reqSent._id });
        if (reqRecv)
            yield friend_request_1.FriendRequest.deleteOne({ _id: reqRecv._id });
        // Block user
        currUser.blockedIds.push(targetId);
        yield currUser.save();
        res.status(200).json({ message: 'User blocked.' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.blockPlayer = blockPlayer;
exports.PlayerController = __importStar(require("./player-controller"));
//# sourceMappingURL=player-controller.js.map