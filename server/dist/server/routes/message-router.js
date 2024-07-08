"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../auth");
const message_controller_1 = require("../controllers/message-controller");
// Check if the user is logged in before fulfilling any authorized request
router.use(auth_1.auth.verifyToken);
router.get('/messages/public/get', message_controller_1.MessageController.getPublicMessages);
router.get('/messages/party/get', message_controller_1.MessageController.getPartyMessages);
router.get('/messages/private/get', message_controller_1.MessageController.getPrivateMessages);
router.post('/messages/public/send', message_controller_1.MessageController.sendPublicMessage);
router.post('/messages/party/send', message_controller_1.MessageController.sendPartyMessage);
router.post('/messages/private/send', message_controller_1.MessageController.sendPrivateMessage);
exports.default = router;
//# sourceMappingURL=message-router.js.map