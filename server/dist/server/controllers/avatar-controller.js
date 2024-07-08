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
exports.AvatarController = exports.updateAvatarList = exports.getAllAvatars = void 0;
const user_1 = require("../models/user");
const avatar_1 = require("../models/avatar");
const getAllAvatars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("get all avatars");
    try {
        const avatars = yield avatar_1.Avatar.find({ isPublic: true });
        if (!avatars) {
            console.log("No avatars found");
            return res.status(404).json({ errorMessage: 'Avatars not found.' });
        }
        else {
            console.log("Avatars found:", avatars);
            return res.status(200).json({ avatars });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.getAllAvatars = getAllAvatars;
const updateAvatarList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Updating Avatar list");
    try {
        const { pic, name, speed, strength, defense, favoredMinigame, isPublic } = req.body;
        const targetUser = yield user_1.User.findOne({ _id: req.userId });
        if (targetUser) {
            const currentAvatar = new avatar_1.Avatar({
                avatarSprite: pic,
                avatarName: name,
                speed: speed,
                strength: strength,
                defense: defense,
                favoredMinigame: favoredMinigame,
                author: targetUser.username,
                comments: [],
                isPublic: isPublic,
            });
            const savedAvatar = yield currentAvatar.save();
            console.log("New Avatar saved: " + savedAvatar);
            yield user_1.User.findOneAndUpdate({ _id: targetUser._id }, { $push: { avatars: currentAvatar } });
            return res.status(200).send();
        }
        else {
            console.log("Avatar not saved");
            return res
                .status(400)
                .json({
                errorMessage: "Avatar List cannot be updated"
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.updateAvatarList = updateAvatarList;
exports.AvatarController = __importStar(require("./avatar-controller"));
//# sourceMappingURL=avatar-controller.js.map