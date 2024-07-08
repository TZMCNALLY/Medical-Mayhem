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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = exports.deleteUser = exports.registerUser = exports.logoutUser = exports.loginUser = exports.getLoggedIn = void 0;
const index_1 = require("../auth/index");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
// Determines and returns if the user is logged in or not
const getLoggedIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email } = req;
    try {
        console.log("REACHED");
        const user = yield user_1.User.findOne({ username: username }, { isAdmin: 1 });
        console.log(user);
        return res.status(200).json({
            loggedIn: true,
            username: username,
            email: email,
            isAdmin: user === null || user === void 0 ? void 0 : user.isAdmin
        });
    }
    catch (err) {
        console.log("err: " + err);
        res.json(false);
    }
});
exports.getLoggedIn = getLoggedIn;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("loginUser");
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        const existingUser = yield user_1.User.findOne({ email: email });
        console.log("existingUser: " + existingUser);
        if (!existingUser) {
            return res
                .status(401)
                .json({
                errorMessage: "Wrong email or password provided."
            });
        }
        console.log("provided password: " + password);
        const passwordCorrect = yield bcrypt_1.default.compare(password, existingUser.passwordHash);
        if (!passwordCorrect) {
            console.log("Incorrect password");
            return res
                .status(401)
                .json({
                errorMessage: "Wrong email or password provided."
            });
        }
        // LOGIN THE USER
        const token = yield index_1.auth.signToken((existingUser._id).toString());
        console.log("token: " + token);
        // Change user's online status to true
        existingUser.onlineStatus = true;
        yield existingUser.save();
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true
        }).status(200).json({
            success: true,
            username: existingUser.username,
            email: existingUser.email
        }).send();
    }
    catch (err) {
        console.error(err);
        res.status(500)
            .json({
            errorMessage: "Could not log in. Please try again later."
        })
            .send();
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    yield user_1.User.findOneAndUpdate({ username: username }, { $set: { onlineStatus: false } });
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none"
    }).send();
});
exports.logoutUser = logoutUser;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, passwordVerify } = req.body;
        console.log("create user: " + username + " " + email + " " + password + " " + passwordVerify);
        if (!username || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        console.log("all fields provided");
        // Password verification
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                errorMessage: "Please enter a password of at least 8 characters."
            });
        }
        console.log("password long enough");
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                errorMessage: "Please enter the same password twice."
            });
        }
        console.log("password and password verify match");
        // Existing user
        const existingUser = yield user_1.User.findOne({ email: email });
        console.log("existingUser: " + existingUser);
        if (existingUser) {
            return res
                .status(400)
                .json({
                success: false,
                errorMessage: "An account with this email address already exists."
            });
        }
        const saltRounds = 10;
        const salt = yield bcrypt_1.default.genSalt(saltRounds);
        const passwordHash = yield bcrypt_1.default.hash(password, salt);
        console.log("passwordHash: " + passwordHash);
        const newUser = new user_1.User({
            // TODO: add rest of user data based on schema if any
            username, email, passwordHash
        });
        const savedUser = yield newUser.save();
        console.log("new user saved: " + savedUser._id);
        // LOGIN THE USER
        const token = yield index_1.auth.signToken((savedUser._id).toString());
        console.log("token:" + token);
        console.log("SAVEDUESR USERNAME: " + savedUser.username);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            username: savedUser.username,
            email: savedUser.email
        }).send();
        console.log("token sent");
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.registerUser = registerUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedUser = yield user_1.User.findByIdAndDelete(req.userId);
        console.log(req.userId);
        res.status(200).send();
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.deleteUser = deleteUser;
exports.AuthController = __importStar(require("./auth-controller"));
//# sourceMappingURL=auth-controller.js.map