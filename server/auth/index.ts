import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction} from 'express'
import { User } from '../models/user'
import bcrypt from 'bcrypt';

declare global {
    namespace Express {
        interface Request {
            userId: string
            username: string,
            email: string
        }
    }

    namespace NodeJS {
        interface ProcessEnv {
            JWT_SECRET: string
        }
    }
}

function authManager() {

    // THIS IS MIDDLEWARE THAT RUNS WITH EVERY REQUEST TO CHECK IF THE TOKEN STILL EXISTS
    const verifyToken = (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies.token;
            // console.log(token)
            if (!token) {
                console.log("TOKEN DOESNT EXIST")
                return res.status(401).json({
                    loggedIn: false,
                    user: null,
                    errorMessage: "Session expired. Please log in again."
                }).send()
            }

            const verified = jwt.verify(token, process.env.JWT_SECRET)
            // console.log("VERIFIED: " + verified)
            // console.log("verified.userId: " + (verified as JwtPayload).userId);
            req.userId = (verified as JwtPayload).userId;
            next();
        } catch (err) {
            console.error(err);
            return res.status(401).json({
                loggedIn: false,
                user: null,
                errorMessage: "Session expired. Please log in again."
            });
        }
    }

    // CHECKS IF THE USER STILL EXISTS IN THE DB
    const verifyUserExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req.userId)
            // Check that the user still exists given id in token
            const loggedInUser = await User.findById(req.userId);

            console.log(loggedInUser)

            // If they don't exist, invalidate their cookie and send back error message
            if (loggedInUser == null) {
                console.log("HIHJDJHKSDF")
                res.cookie("token", "", {
                    httpOnly: true,
                    expires: new Date(0),
                    secure: true,
                    sameSite: "none"
                }).status(404).json({
                    loggedIn: false,
                    user: null,
                    errorMessage: "User no longer exists."
                }).send();
                return
            }

            // Insert data of user into request otherwise
            req.username = loggedInUser.username
            req.email = loggedInUser.email

            console.log(next.name)
            next()

        } catch (err) {
            res.cookie("token", "", {
                httpOnly: true,
                expires: new Date(0),
                secure: true,
                sameSite: "none"
            }).status(404).json({
                loggedIn: false,
                user: null,
                errorMessage: "User no longer exists."
            }).send();
        }
    }

    const signToken = async (userId: string) => {

        const token = await jwt.sign({
            userId: userId 
        }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        console.log(token)

        return token
    }

    return {
        verifyToken,
        verifyUserExists,
        signToken
    };
}

export const auth = authManager();