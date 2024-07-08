"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const avatar_controller_1 = require("../controllers/avatar-controller");
// router.use(auth.verifyToken)
router.get('/avatars', avatar_controller_1.AvatarController.getAllAvatars);
router.post('/updateAvatarList', avatar_controller_1.AvatarController.updateAvatarList);
exports.default = router;
//# sourceMappingURL=avatar-router.js.map