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
exports.FriendController = exports.acceptFriendRequest = exports.ignoreFriendRequest = exports.cancelFriendRequest = exports.viewReceivedFriendRequests = exports.viewSentFriendRequests = exports.viewFriends = exports.removeFriend = exports.sendFriend = void 0;
const user_1 = require("../models/user");
const friend_request_1 = require("../models/friend-request");
//TODO: might have to add additional middleware that check if the user still exists
const sendFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = yield user_1.User.findById(req.userId);
        if (!currentUser)
            return res.status(400).json({ errorMessage: 'Current user not found.' });
        const { targetUsername } = req.body;
        if (targetUsername === '')
            return res.status(400).json({ errorMessage: 'You must enter a username.' });
        // User enters their own username
        if (targetUsername === currentUser.username)
            return res.status(400).json({ errorMessage: 'You cannot be friends with yourself.' });
        // If specified user is invalid
        const targetUser = yield user_1.User.findOne({ username: targetUsername });
        if (!targetUser)
            return res.status(400).json({ errorMessage: 'User ' + targetUsername + ' not found.' });
        // If user is already friends with specified user
        if (currentUser.friendsIds.includes(targetUser._id))
            return res.status(400).json({ errorMessage: 'You are already friends with this user.' });
        // If user already sent a friend request to the specified user
        const friendRequestSentAlready = yield friend_request_1.FriendRequest.findOne({ sender: req.userId, receiver: targetUser._id });
        if (friendRequestSentAlready)
            return res.status(400).json({ errorMessage: 'You already sent a friend request to this user.' });
        // Check if target user has current user blocked or if current user has target user blocked
        if (targetUser.blockedIds.includes(currentUser._id) || currentUser.blockedIds.includes(targetUser._id))
            return res.status(400).json({ errorMessage: 'Unable to send friend request to this user.' });
        // Successful friend request: New document in FriendRequest collection with sender ID and receiver ID
        const friendReq = new friend_request_1.FriendRequest({ sender: req.userId, receiver: targetUser._id });
        friendReq.save();
        res.status(200).send();
    }
    catch (err) {
        console.error(err);
        res.status(400).send();
    }
});
exports.sendFriend = sendFriend;
const removeFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = yield user_1.User.findById(req.userId);
        if (!currentUser)
            return res.status(400).json({ errorMessage: 'Current user not found.' });
        const { username } = req.body;
        console.log('username:', username);
        const targetUser = yield user_1.User.findOne({ username: username });
        if (!targetUser)
            return res.status(400).json({ errorMessage: 'Target user not found.' });
        yield user_1.User.updateOne({ _id: currentUser._id }, { $pull: { friendsIds: targetUser._id } });
        yield user_1.User.updateOne({ _id: targetUser._id }, { $pull: { friendsIds: currentUser._id } });
        res.status(200).send();
    }
    catch (err) {
        console.error(err);
        res.status(400).send();
    }
});
exports.removeFriend = removeFriend;
const viewFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = yield user_1.User.findById(req.userId);
        if (!currentUser)
            return res.status(400).json({ errorMessage: 'Current user not found.' });
        const friends = [];
        yield Promise.all(currentUser.friendsIds.map((friendId) => __awaiter(void 0, void 0, void 0, function* () {
            const friend = yield user_1.User.findById(friendId);
            if (friend) {
                friends.push({
                    username: friend.username,
                    profilePicture: friend.profilePicture,
                    onlineStatus: friend.onlineStatus
                });
            }
        })));
        return res.status(200).json({ players: friends });
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.viewFriends = viewFriends;
const viewSentFriendRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sentFriendReqs = yield friend_request_1.FriendRequest.find({ sender: req.userId });
        if (!sentFriendReqs)
            return res.status(400).json({ errorMessage: 'Current user not found.' });
        const receivers = [];
        yield Promise.all(sentFriendReqs.map((friendReq) => __awaiter(void 0, void 0, void 0, function* () {
            const receiver = yield user_1.User.findById(friendReq.receiver);
            if (receiver) {
                receivers.push({
                    username: receiver.username,
                    profilePicture: receiver.profilePicture,
                    onlineStatus: receiver.onlineStatus
                });
            }
        })));
        return res.status(200).json({ players: receivers });
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.viewSentFriendRequests = viewSentFriendRequests;
const viewReceivedFriendRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receivedFriendReqs = yield friend_request_1.FriendRequest.find({ receiver: req.userId });
        if (!receivedFriendReqs)
            return res.status(400).json({ errorMessage: 'Current user not found.' });
        const senders = [];
        yield Promise.all(receivedFriendReqs.map((friendReq) => __awaiter(void 0, void 0, void 0, function* () {
            const sender = yield user_1.User.findById(friendReq.sender);
            if (sender) {
                senders.push({
                    username: sender.username,
                    profilePicture: sender.profilePicture,
                    onlineStatus: sender.onlineStatus
                });
            }
        })));
        return res.status(200).json({ players: senders });
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.viewReceivedFriendRequests = viewReceivedFriendRequests;
const cancelFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('cancelFriendRequest');
        const username = req.body.targetUser;
        const targetUser = yield user_1.User.findOne({ username: username });
        if (!targetUser)
            return res.status(400).json({ errorMessage: 'Target user not found.' });
        console.log(req.userId, targetUser._id);
        yield friend_request_1.FriendRequest.findOneAndDelete({ $and: [{ sender: req.userId }, { receiver: targetUser._id }] });
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.cancelFriendRequest = cancelFriendRequest;
const ignoreFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('ignoreFriendRequest');
        const username = req.body.targetUser;
        const targetUser = yield user_1.User.findOne({ username: username });
        if (!targetUser)
            return res.status(400).json({ errorMessage: 'Target user not found.' });
        console.log(req.userId, targetUser._id);
        yield friend_request_1.FriendRequest.findOneAndDelete({ $and: [{ sender: targetUser._id }, { receiver: req.userId }] });
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.ignoreFriendRequest = ignoreFriendRequest;
const acceptFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('acceptFriendRequest');
        const username = req.body.targetUser;
        const targetUser = yield user_1.User.findOne({ username: username });
        if (!targetUser)
            return res.status(400).json({ errorMessage: 'Target user not found.' });
        console.log(targetUser);
        // Remove friend request with current sender and receiver from collection
        console.log('userId:', req.userId);
        const findReq = yield friend_request_1.FriendRequest.findOneAndDelete({ $and: [{ sender: targetUser._id }, { receiver: req.userId }] });
        console.log(findReq);
        const updateSender = yield user_1.User.updateOne({ _id: req.userId }, { $push: { friendsIds: targetUser._id } }); // Add receiver to sender's friends list
        console.log('updateSender:', updateSender);
        const updateReceiver = yield user_1.User.updateOne({ _id: targetUser._id }, { $push: { friendsIds: req.userId } }); // Add sender to receiver's friends list
        console.log('updateReceiver:', updateReceiver);
        res.status(200).send();
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.acceptFriendRequest = acceptFriendRequest;
exports.FriendController = __importStar(require("./friend-controller"));
//# sourceMappingURL=friend-controller.js.map