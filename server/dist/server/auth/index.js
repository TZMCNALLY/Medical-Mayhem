"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
function authManager() {
    // THIS IS MIDDLEWARE THAT RUNS WITH EVERY REQUEST TO CHECK IF THE TOKEN STILL EXISTS
    const verifyToken = (req, res, next) => {
        try {
            const token = req.cookies.token;
            console.log(token);
            if (!token) {
                console.log("TOKEN DOESNT EXIST");
                return res.status(401).json({
                    loggedIn: false,
                    user: null,
                    errorMessage: "Unauthorized"
                }).send();
            }
            const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            console.log("VERIFIED: " + verified);
            console.log("verified.userId: " + verified.userId);
            req.userId = verified.userId;
            console.log("PASSED");
            next();
        }
        catch (err) {
            console.error(err);
            return res.status(401).json({
                loggedIn: false,
                user: null,
                errorMessage: "Unauthorized"
            });
        }
    };
    // CHECKS IF THE USER STILL EXISTS IN THE DB
    const verifyUserExists = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(req.userId);
            // Check that the user still exists given id in token
            const loggedInUser = yield user_1.User.findById(req.userId);
            console.log(loggedInUser);
            // If they don't exist, invalidate their cookie and send back error message
            if (loggedInUser == null) {
                console.log("HIHJDJHKSDF");
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
                return;
            }
            // Insert data of user into request otherwise
            req.username = loggedInUser.username;
            req.email = loggedInUser.email;
            console.log(next.name);
            next();
        }
        catch (err) {
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
    });
    const signToken = (userId) => __awaiter(this, void 0, void 0, function* () {
        const token = yield jsonwebtoken_1.default.sign({
            userId: userId
        }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });
        console.log(token);
        return token;
    });
    return {
        verifyToken,
        verifyUserExists,
        signToken
    };
}
exports.auth = authManager();
//# sourceMappingURL=index.js.map