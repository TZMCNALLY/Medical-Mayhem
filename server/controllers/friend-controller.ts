import { auth } from '../auth/index'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express';
import { User } from '../models/user'
import { FriendRequest } from '../models/friend-request';

//TODO: might have to add additional middleware that check if the user still exists

export const sendFriend = async (req: Request, res: Response) => {
    try {
        const currentUser = await User.findById(req.userId);
        if(!currentUser) return res.status(400).json({errorMessage: 'Current user not found.'});
        const {targetUsername} = req.body;
        if(targetUsername === '') return res.status(400).json({errorMessage: 'You must enter a username.'});
        // User enters their own username
        if(targetUsername === currentUser.username) return res.status(400).json({errorMessage: 'You cannot be friends with yourself.'});
        
        // If specified user is invalid
        const targetUser = await User.findOne({username: targetUsername});
        if(!targetUser) return res.status(400).json({errorMessage: 'User ' + targetUsername + ' not found.'});

        // If user is already friends with specified user
        if(currentUser.friendsIds.includes(targetUser._id)) return res.status(400).json({errorMessage: 'You are already friends with this user.'});

        // If user already sent a friend request to the specified user
        const friendRequestSentAlready = await FriendRequest.findOne({sender: req.userId, receiver: targetUser._id});
        if(friendRequestSentAlready) return res.status(400).json({errorMessage: 'You already sent a friend request to this user.'});
        
        // Check if target user has current user blocked or if current user has target user blocked
        if(targetUser.blockedIds.includes(currentUser._id) || currentUser.blockedIds.includes(targetUser._id))
            return res.status(400).json({errorMessage: 'Unable to send friend request to this user.'});

        // Successful friend request: New document in FriendRequest collection with sender ID and receiver ID
        const friendReq = new FriendRequest({sender: req.userId, receiver: targetUser._id})
        friendReq.save();

        // Send list of sent friend requests back to client
        const friendRequests = await FriendRequest.find({sender: req.userId});
        const receiverIds = friendRequests.map(req => req.receiver);
        const senders = await User.find({_id: {$in: receiverIds}}, {username: 1, onlineStatus: 1, profilePicture: 1})
        res.status(200).send(senders);
    } catch(err) {
        console.error(err);
        res.status(400).send();
    }
}

export const removeFriend = async (req: Request, res: Response) => {
    try {
        let currentUser = await User.findById(req.userId);
        if(!currentUser) return res.status(400).json({errorMessage: 'Current user not found.'});
        const {username} = req.body;
        console.log('username:', username);
        const targetUser = await User.findOne({username: username});
        if(!targetUser) return res.status(400).json({errorMessage: 'Target user not found.'});
        await User.updateOne({_id: currentUser._id}, {$pull: {friendsIds: targetUser._id}});
        await User.updateOne({_id: targetUser._id}, {$pull: {friendsIds: currentUser._id}});
        
        currentUser = await User.findById(req.userId);
        if(!currentUser) return res.status(400).json({errorMessage: 'Current user not found.'});
        const friends: {username: string, profilePicture: string, onlineStatus: boolean}[] = [];
        await Promise.all(currentUser.friendsIds.map(async (friendId) => {
            const friend = await User.findById(friendId);
            if(friend) {
                friends.push({
                    username: friend.username,
                    profilePicture: friend.profilePicture,
                    onlineStatus: friend.onlineStatus
                })
            }
        }));
        return res.status(200).json(friends)
    } catch(err) {
        console.error(err);
        res.status(400).send();
    }
}

export const viewFriends = async (req: Request, res: Response) => {
    try {
        const currentUser = await User.findById(req.userId);
        if(!currentUser) return res.status(400).json({errorMessage: 'Current user not found.'});
        const friends: {username: string, profilePicture: string, onlineStatus: boolean}[] = [];
        await Promise.all(currentUser.friendsIds.map(async (friendId) => {
            const friend = await User.findById(friendId);
            if(friend) {
                friends.push({
                    username: friend.username,
                    profilePicture: friend.profilePicture,
                    onlineStatus: friend.onlineStatus
                })
            }
        }));
        return res.status(200).json(friends)
    } catch(err) {
        console.error(err);
        res.status(500).send();
    }
}

export const viewSentFriendRequests = async (req: Request, res: Response) => {
    try {
        const sentFriendReqs = await FriendRequest.find({sender: req.userId});
        if(!sentFriendReqs) return res.status(400).json({errorMessage: 'Current user not found.'});
        const receivers: {username: string, profilePicture: string, onlineStatus: boolean}[] = [];
        await Promise.all(sentFriendReqs.map(async (friendReq) => {
            const receiver = await User.findById(friendReq.receiver);
            if(receiver) {
                receivers.push({
                    username: receiver.username,
                    profilePicture: receiver.profilePicture,
                    onlineStatus: receiver.onlineStatus
                })
            }
        }));
        return res.status(200).json(receivers)
    } catch(err) {
        console.error(err);
        res.status(500).send();
    }
}

export const viewReceivedFriendRequests = async (req: Request, res: Response) => {
    try {
        const receivedFriendReqs = await FriendRequest.find({receiver: req.userId});
        if(!receivedFriendReqs) return res.status(400).json({errorMessage: 'Current user not found.'});
        const senders: {username: string, profilePicture: string, onlineStatus: boolean}[] = [];
        await Promise.all(receivedFriendReqs.map(async (friendReq) => {
            const sender = await User.findById(friendReq.sender);
            if(sender) {
                senders.push({
                    username: sender.username,
                    profilePicture: sender.profilePicture,
                    onlineStatus: sender.onlineStatus
                })
            }
        }));
        return res.status(200).json(senders)
    } catch(err) {
        console.error(err);
        res.status(500).send();
    }
}

export const cancelFriendRequest = async (req: Request, res: Response) => {
    try {
        console.log('cancelFriendRequest')
        const username = req.body.targetUser;
        const targetUser = await User.findOne({username: username});
        if(!targetUser) return res.status(400).json({errorMessage: 'Target user not found.'});
        console.log(req.userId, targetUser._id);
        await FriendRequest.findOneAndDelete({$and: [{sender: req.userId}, {receiver: targetUser._id}]});

        // Send list of sent friend requests back to client
        const friendRequests = await FriendRequest.find({sender: req.userId});
        const receiverIds = friendRequests.map(req => req.receiver);
        console.log(receiverIds);
        const senders = await User.find({_id: {$in: receiverIds}}, {username: 1, onlineStatus: 1, profilePicture: 1})
        res.status(200).send(senders);
    } catch(err) {
        console.error(err);
        res.status(500).send();
    }
}

export const ignoreFriendRequest = async (req: Request, res: Response) => {
    try {
        console.log('ignoreFriendRequest')
        const username = req.body.targetUser;
        const targetUser = await User.findOne({username: username});
        if(!targetUser) return res.status(400).json({errorMessage: 'Target user not found.'});
        console.log(req.userId, targetUser._id);
        await FriendRequest.findOneAndDelete({$and: [{sender: targetUser._id}, {receiver: req.userId}]})

        // Send updated list of receiver friend requests to client
        const friendRequests = await FriendRequest.find({receiver: req.userId});
        const senderIds = friendRequests.map(req => req.sender);
        console.log(senderIds);
        const senders = await User.find({_id: {$in: senderIds}})
        res.status(200).send(senders);
    } catch(err) {
        console.error(err);
        res.status(500).send();
    }
}

export const acceptFriendRequest = async (req: Request, res: Response) => {
    try {
        console.log('acceptFriendRequest')
        const username = req.body.targetUser;
        const targetUser = await User.findOne({username: username});
        if(!targetUser) return res.status(400).json({errorMessage: 'Target user not found.'});
        console.log(targetUser);
        
        // Remove friend request with current sender and receiver from collection
        console.log('userId:', req.userId);
        const findReq = await FriendRequest.findOneAndDelete({$and: [{sender: targetUser._id}, {receiver: req.userId}]})
        console.log(findReq);

        const updateSender = await User.updateOne({_id: req.userId}, {$push: {friendsIds: targetUser._id}}) // Add receiver to sender's friends list
        console.log('updateSender:', updateSender);
        const updateReceiver = await User.updateOne({_id: targetUser._id}, {$push: {friendsIds: req.userId}}) // Add sender to receiver's friends list
        console.log('updateReceiver:', updateReceiver);

        // Send updated list of received friend requests to client
        const friendRequests = await FriendRequest.find({receiver: req.userId});
        const senderIds = friendRequests.map(req => req.sender);
        console.log(senderIds);
        const senders = await User.find({_id: {$in: friendRequests.map(req => req.sender)} })
        res.status(200).send(senders);
    } catch(err) {
        console.error(err);
        res.status(500).send();
    }
}

export * as FriendController from './friend-controller'