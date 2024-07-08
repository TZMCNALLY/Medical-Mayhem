"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const friend_controller_1 = require("../controllers/friend-controller");
const auth_1 = require("../auth");
// Check if the user is logged in before fulfilling any authorized request
router.use(auth_1.auth.verifyToken);
router.get('/friends', friend_controller_1.FriendController.viewFriends);
router.post('/friendRequest/:targetUser', friend_controller_1.FriendController.sendFriend);
router.post('/friend/remove/:targetUser', friend_controller_1.FriendController.removeFriend);
router.get('/friendRequests/sent', friend_controller_1.FriendController.viewSentFriendRequests);
router.get('/friendRequests/received', friend_controller_1.FriendController.viewReceivedFriendRequests);
router.post('/friendRequest/:targetUser/cancel', friend_controller_1.FriendController.cancelFriendRequest);
router.post('/friendRequest/:targetUser/ignore', friend_controller_1.FriendController.ignoreFriendRequest);
router.post('/friendRequest/:targetUser/accept', friend_controller_1.FriendController.acceptFriendRequest);
exports.default = router;
//# sourceMappingURL=social-router.js.map