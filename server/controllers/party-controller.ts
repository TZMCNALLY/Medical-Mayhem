import { auth } from '../auth/index'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express';
import { User } from '../models/user'
import { Party } from '../models/party';

//TODO: might have to add additional middleware that check if the user still exists

// Gets user data necessary to render on the sidebar
export const getUserPartyInfo = async (req: Request, res: Response) => {
    console.log(req.params)
    try {
        const {username} = req.params;
        const user = await User.findOne({username: username})
        if(!user) return res.status(400).json({errorMessage: 'User not found.'});

        res.status(200).json({
            id: user._id,
            username: username,
            profilePicture: user.profilePicture
        });
    } catch(err) {
        console.error(err)
        res.status(400).send()
    }
}

export * as PartyController from './party-controller'