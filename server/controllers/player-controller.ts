import { auth } from '../auth/index'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express';
import { User } from '../models/user'
import { Avatar } from '../models/avatar';
import { FriendRequest } from '../models/friend-request';

//TODO: might have to add additional middleware that check if the user still exists

export const getProfile = async (req: Request, res: Response) => {
    console.log("getProfile")
    try {
        console.log(req.userId)
        const {username} = req.body;
        const existingUser = await User.findOne({username: username});
        console.log("existingUser: " + existingUser);
        if (!existingUser) {
            return res
                .status(400)
                .json({
                    errorMessage: "User does not exist."
                })
        }
        console.log('month:', existingUser.dateRegistered.getMonth())

        return res
            .status(200)
            .json({
                bio: existingUser.bio,
                pfp: existingUser.profilePicture,
                regDate: existingUser.dateRegistered,
                // regDate: {month: existingUser.dateRegistered.getMonth(), date: existingUser.dateRegistered.getFullYear(), day: existingUser.dateRegistered.getDay()},
            })
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { bio, pfp} = req.body

        console.log("BIO: " + bio)
        console.log("PFP: " + pfp)

        let updatedUser

        if (pfp) {
            console.log("UPDATIN USER")
            updatedUser = await User.updateOne(
                {_id: req.userId},
                {$set: {bio: bio, profilePicture: pfp}}
            );
        }

        else {
            updatedUser = await User.updateOne(
                {_id: req.userId},
                {$set: {bio: bio}}
            );
        }

        if (!updatedUser) {
            return res
                .status(400)
                .json({
                    errorMessage: "User cannot be updated."
                })
        }

        return res.status(200).send()

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

export const getRecentPlayers = async (req: Request, res: Response) => {
    try {
        const currentUser = await User.findById(req.userId);
        if(!currentUser) return res.status(400).json({errorMessage: 'Current user not found.'});
        const recentPlayers: {username: string, profilePicture: string, onlineStatus: boolean}[] = [];
        await Promise.all(currentUser.recentPlayers.map(async (recentPlayerId) => {
            const recentPlayer = await User.findById(recentPlayerId);
            if(recentPlayer) {
                recentPlayers.push({
                    username: recentPlayer.username,
                    profilePicture: recentPlayer.profilePicture,
                    onlineStatus: recentPlayer.onlineStatus
                })
            }
        }));
        return res.status(200).json(recentPlayers)
    } catch(err) {
        console.error(err);
        res.status(500).send();
    }
}

export const getAvatar = async (req: Request, res: Response) => {
    console.log("getAvatar")
    try {
        const existingUser = await User.findById(req.userId);
        if (!existingUser) {
            return res
                .status(400)
                .json({
                    errorMessage: "User does not exist."
                })
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
            })
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

export const getMyAvatars = async (req: Request, res: Response) => {    
    try {
        const currentUser = await User.findById(req.userId).populate('avatars');

        if(currentUser) {
            const avatars = currentUser.avatars;

            if(!avatars) {
                console.log("No avatars found");
                return res.status(404).json({errorMessage: 'Avatars not found.'});
            }
            else {
                console.log("Avatars found:", avatars);
                return res.status(200).json({avatars})
            }
        }
        else {
            console.log("No user found");
            return res.status(404).json({errorMessage: 'Current user not found.'});
        }
    }
    catch(err) {
        console.error(err);
        res.status(500).send();
    }
}

export const updateAvatar = async (req: Request, res: Response) => {
    try {
        const { pic, name, speed, strength, defense, favoredMinigame, isPublic, id } = req.body;

        const updatedUser = await User.updateOne(
            { _id: req.userId },
            {
                $set: {
                    avatarSprite: pic,
                    avatarName: name,
                    speed: speed,
                    strength: strength,
                    defense: defense,
                    favoredMinigame: favoredMinigame,
                    isPublic: isPublic
                }
            }
        );

        console.log("updatedUser: ", updatedUser);

        if(!updatedUser) {
            return res.status(400).json({ errorMessage: "User cannot be updated." });
        }

        if(id) {
            const updatedAvatar = await Avatar.findByIdAndUpdate(
                id,
                {
                    avatarSprite: pic,
                    avatarName: name,
                    speed: speed,
                    strength: strength,
                    defense: defense,
                    favoredMinigame: favoredMinigame,
                    isPublic: isPublic
                },
                { new: true } // Return the updated document
            );

            console.log("updatedAvatar: ", updatedAvatar);

            if (!updatedAvatar) {
                return res.status(400).json({ errorMessage: "Avatar cannot be updated." });
            }
        }

        return res.status(200).send();
    } catch (err) {
        console.error(err);
        return res.status(500).send();
    }
}

export const deleteAvatar = async (req: Request, res: Response) => {
    const avatarId = req.params.id; 
    
    try {
        // Check if the avatar exists
        const avatar = await Avatar.findById(avatarId);
        if (!avatar) {
            return res.status(404).json({ message: 'Avatar not found' });
        }

        // Delete the avatar
        await Avatar.findByIdAndDelete(avatarId);

        return res.status(200).json({ message: 'Avatar deleted successfully' });
    } catch (error) {
        console.error('Error deleting avatar:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const getSettings = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({_id: req.userId}, {masterVolume: 1, musicVolume: 1, sfxVolume: 1, keybinds: 1, appearAsOffline: 1, toggleChat: 1, toggleParty: 1});
        if(!user) return res.status(400).send({errorMessage: 'User not found.'});
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
        })
    } catch(err) {
        console.error(err);
        res.status(500).send();
    }
}

export const updateAudioSettings = async (req: Request, res: Response) => {
    try {
        const {masterVolume, musicVolume, sfxVolume} = req.body;
        await User.updateOne({_id: req.userId}, {$set: {masterVolume: masterVolume, musicVolume: musicVolume, sfxVolume: sfxVolume}});
        res.status(200).send();
    } catch(err) {
        console.error(err);
        res.status(500).send();
    }
}

export const updateKeybinds = async (req: Request, res: Response) => {
    try {
        const {UP, LEFT, DOWN, RIGHT, INTERACT} = req.body;
        const currUser = await User.findOne({_id: req.userId});
        if(!currUser) return res.status(400).send('User not found.');
        const newKeybinds = {
            UP: UP || currUser.keybinds?.UP,
            LEFT: LEFT || currUser.keybinds?.LEFT,
            DOWN: DOWN || currUser.keybinds?.DOWN,
            RIGHT: RIGHT || currUser.keybinds?.RIGHT,
            INTERACT: INTERACT || currUser.keybinds?.INTERACT,
        };
        await User.updateOne({_id: req.userId}, {$set: {keybinds: newKeybinds}});
        res.status(200).send();

    } catch(err) {
        console.error(err);
        res.status(500).send();
    }
}

export const updateToggles = async (req: Request, res: Response) => {
    try {
        const {privateProfile, toggleChat, toggleParty} = req.body;
        await User.updateOne({_id: req.userId}, {$set: {appearAsOffline: privateProfile, toggleChat: toggleChat, toggleParty: toggleParty}});
        res.status(200).send();
    } catch(err) {
        console.error(err);
        res.status(500).send();
    }
}

export const viewOnlinePlayers = async (req: Request, res: Response) => {
    try {
        // Sorts by username from A-Z. Collation makes it case-insensitive
        const currUser = await User.findOne({_id: req.userId}, {username: 1});
        if(!currUser) return res.status(400).json({errorMessage: 'User not found.'});
        const onlinePlayersTemp = await User.find({$and: [{onlineStatus: true}, {username: {$ne: currUser.username}}]}, {username: 1}).collation({locale: 'en', strength: 2}).sort({username: 1});
        const onlinePlayers: {username: string, profilePicture: string, onlineStatus: boolean}[] = [];
        await Promise.all(onlinePlayersTemp.map(async (onlinePlayerId) => {
            const onlinePlayer = await User.findById(onlinePlayerId);
            if(onlinePlayer) {
                onlinePlayers.push({
                    username: onlinePlayer.username,
                    profilePicture: onlinePlayer.profilePicture,
                    onlineStatus: onlinePlayer.onlineStatus
                })
            }
        }));
        return res.status(200).json(onlinePlayers);
    } catch(err) {
        console.error(err);
        res.status(500).send();
    }
}

export const getRelationToUser = async (req: Request, res: Response) => {
    try {
        const currUser = await User.findOne({_id: req.userId}, {username: 1, friendsIds: 1, blockedIds: 1});
        const targetUser = await User.findOne({username: req.body.targetUsername}, {_id: 1, friendsIds: 1, blockedIds: 1});
        if(!currUser || !targetUser) return res.status(400).json({errorMessage: 'User not found.'});
        const targetId = targetUser._id;
        const reqSent = await FriendRequest.findOne({sender: currUser._id, receiver: targetId});
        const reqRecv = await FriendRequest.findOne({receiver: currUser._id, sender: targetId});
        if(currUser.friendsIds.includes(targetId) && targetUser.friendsIds.includes(currUser._id)) res.status(200).send('FRIENDS');
        else if(reqSent) res.status(200).send('SENT');
        else if(reqRecv) res.status(200).send('RECEIVED');
        else if(currUser.blockedIds.includes(targetId)) res.status(200).send('BLOCKED');
    } catch(err) {
        console.error(err);
        res.status(500).send();
    }
}

export const blockPlayer = async (req: Request, res: Response) => {
    try {
        const currUser = await User.findOne({_id: req.userId}, {username: 1, friendsIds: 1, blockedIds: 1});
        const targetUser = await User.findOne({username: req.body.targetUsername}, {_id: 1, friendsIds: 1, blockedIds: 1});
        if(!currUser || !targetUser) return res.status(400).json({errorMessage: 'User not found.'});
        const targetId = targetUser._id;
        
        // If current and target user are friends, remove from each other's friend lists
        if(currUser.friendsIds.includes(targetId)) {
            let ind = currUser.friendsIds.indexOf(targetId);
            if(ind > -1) currUser.friendsIds.splice(ind, 1);
            ind = targetUser.friendsIds.indexOf(currUser._id);
            if(ind > -1) targetUser.friendsIds.splice(ind, 1);
        }

        // If current user sent a friend request to target user (or vice versa), remove friend request
        const reqSent = await FriendRequest.findOne({sender: currUser._id, receiver: targetId});
        const reqRecv = await FriendRequest.findOne({receiver: currUser._id, sender: targetId});
        if(reqSent) await FriendRequest.deleteOne({_id: reqSent._id});
        if(reqRecv) await FriendRequest.deleteOne({_id: reqRecv._id});

        // Block user
        currUser.blockedIds.push(targetId);
        await currUser.save();
        res.status(200).json({message: 'User blocked.'});
    } catch(err) {
        console.error(err);
        res.status(500).send();
    }
}

export * as PlayerController from './player-controller'