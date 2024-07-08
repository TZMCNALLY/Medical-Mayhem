import { auth } from '../auth/index'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express';
import { User } from '../models/user'
import { Message } from '../models/message';
import { PublicChat } from '../models/public-chat';
import { PrivateMessage } from '../models/private-message';

//TODO: might have to add additional middleware that check if the user still exists

export const getPrivateMessages = async (req: Request, res: Response) => {
    console.log('get private messages');
    // const privateChat = await PrivateMessage.find();
    // if(!privateChat) return res.status(400).json({error: 'Private chat could not be retrieved.'});
    // const privateMessages = privateChat[0].messages;
    // const messages : {username: string, text: string, date: Date}[] = [];
    // await Promise.all(privateMessages.map(async (publicMessage) => {
    //     const message = await Message.findOne({_id: publicMessage._id});
    //     if(!message) return res.status(400).json({error: 'Could not retrieve message.'});
    //     const user = await User.findOne({_id: message.senderId}, {username: 1})
    //     if(user) messages.push({username: user.username, text: message.text, date: message.sendDate});
    // }))
    // messages.sort((d1, d2) => d1.date.getTime() - d2.date.getTime());
    // return res.status(200).json(messages);
}

export const sendPrivateMessage = async (req: Request, res: Response) => {
    const {username, message} = req.body;
    console.log('username:', username, 'message:', message);
    // if(!message) return res.status(400).json({error: 'Message is required'});
    // const sender = await User.findOne({username: username}, {_id: 1});
    // if(!sender) return res.status(400).json({error: 'User not found.'});
    // const msg = new Message({senderId: sender._id, text: message});
    // msg.save();
    // let privateChat = await PrivateMessage.findOne();
    // console.log(privateChat);
    // if(!privateChat) {
    //     const pc = new PrivateMessage({messages: []});
    //     pc.save();
    // }
    // await PrivateMessage.updateOne({}, {$push: {messages: msg}});
    // return getPrivateMessages(req, res);
}

export * as MessageController from './message-controller'