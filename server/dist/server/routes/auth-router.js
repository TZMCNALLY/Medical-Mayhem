"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_controller_1 = require("../controllers/auth-controller");
const auth_1 = require("../auth");
router.use('/loggedIn', auth_1.auth.verifyToken);
router.use('/loggedIn', auth_1.auth.verifyUserExists);
router.use('/deleteUser', auth_1.auth.verifyToken);
router.use('/deleteUser', auth_1.auth.verifyUserExists);
router.post('/register', auth_controller_1.AuthController.registerUser);
router.post('/login', auth_controller_1.AuthController.loginUser);
router.post('/logout', auth_controller_1.AuthController.logoutUser);
router.get('/loggedIn', auth_controller_1.AuthController.getLoggedIn);
router.post('/deleteUser', auth_controller_1.AuthController.deleteUser);
exports.default = router;
//# sourceMappingURL=auth-router.js.map