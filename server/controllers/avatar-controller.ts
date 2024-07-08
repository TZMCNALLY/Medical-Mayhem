import { Request, Response } from 'express';
import { User } from '../models/user'
import { Avatar } from '../models/avatar';
import { Comment } from '../models/comment';
import { Types } from 'mongoose';

export const loadAvatar = async (req: Request, res: Response) => {
    console.log("load avatar")
    const { avatar } = req.params;
    const targetId = new Types.ObjectId(avatar);

    try {
        const existingAvatar = await Avatar.findById(targetId).populate('comments');
        if (!existingAvatar) {
            return res
                .status(400)
                .json({
                    errorMessage: "Avatar does not exist."
                })
        }

        return res
            .status(200)
            .json({existingAvatar})
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

export const getAllAvatars = async (req: Request, res: Response) => {
    console.log("get all avatars");
    
    try {
        const avatars = await Avatar.find({isPublic: true});

        if(!avatars) {
            console.log("No avatars found");
            return res.status(404).json({errorMessage: 'Avatars not found.'});
        }
        else {
            console.log("Avatars found:", avatars);
            return res.status(200).json({avatars})
        }
    }
    catch(err) {
        console.error(err);
        res.status(500).send();
    }
}

export const searchAvatars = async (req: Request, res: Response) => {
    console.log("search avatars");

    const { params } = req.params;
    const searchRegex = new RegExp(params, 'i');
    
    try {
        const avatars = await Avatar.find({
            isPublic: true,
            avatarName: { $regex: searchRegex }
        });

        if(!avatars) {
            console.log("No avatars found");
            return res.status(404).json({errorMessage: 'Avatars not found.'});
        }
        else {
            console.log("Avatars found:", avatars);
            return res.status(200).json({avatars})
        }
    }
    catch(err) {
        console.error(err);
        res.status(500).send();
    }
}

export const updateAvatarList = async (req: Request, res: Response) => {
    console.log("Updating Avatar list");
    try {
        const { pic, name, speed, strength, defense, favoredMinigame, isPublic, id } = req.body;
        const targetUser = await User.findOne({ _id: req.userId });

        if(!targetUser) {
            console.log("Avatar not saved");
            return res.status(400).json({ errorMessage: "Avatar List cannot be updated" });
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

            if(!updatedAvatar) {
                return res.status(400).json({ errorMessage: "Avatar cannot be updated." });
            }

            return res.status(200).send();
        }

        // If id is not provided, create a new Avatar object
        const currentAvatar = new Avatar({
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

        const savedAvatar = await currentAvatar.save();
        console.log("New Avatar saved: " + savedAvatar);

        // Update the User's avatars array
        await User.findOneAndUpdate(
            { _id: targetUser._id },
            { $push: { avatars: currentAvatar } }
        );

        return res.status(200).send();
    } 
    catch (err) {
        console.error(err);
        return res.status(500).send();
    }
};

export const getComments = async (req: Request, res: Response) => {
    const { avatar } = req.params;
    const targetId = new Types.ObjectId(avatar);
    
    try {
        const targetAvatar = await Avatar.findOne({_id: targetId}).populate('comments');
        if(!targetAvatar) {
            console.log("No avatars found");
            return res.status(404).json({errorMessage: 'Avatar not found.'});
        }
        else {
            const comments = targetAvatar.comments;
            console.log('comments:', comments);
            return res.status(200).json({comments});
        }
    }
    catch(err) {
        console.error(err);
        res.status(500).send();
    }
}

export const addComment = async (req: Request, res: Response) => {
    console.log("Adding comment");
    try {
        const {text, targetAvatar} = req.body;
        const author = await User.findOne({_id: req.userId}, {username: 1});

        if(author) {
            console.log(author);
            const comment = new Comment({
                senderId: author,
                senderUsername: author.username,
                text: text,
                sendDate: new Date()
            });
    
            const savedComment = await comment.save();
            console.log("New Comment saved: " + savedComment);

            await Avatar.findOneAndUpdate(
                { _id: targetAvatar._id },
                { $push: { comments: comment } }
            );
            
            return res.status(200).send()
        }
        else {
            console.log("Comment not sent.");
            return res
                .status(400)
                .json({
                    errorMessage: "Avatar Comment List cannot be updated"
                })
        }
        
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

export * as AvatarController from './avatar-controller'