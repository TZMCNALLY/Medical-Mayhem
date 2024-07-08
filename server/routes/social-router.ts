import express from 'express'
const router = express.Router()
import { FriendController } from '../controllers/friend-controller'
import { auth } from '../auth'

// Check if the user is logged in before fulfilling any authorized request
router.use(auth.verifyToken)

router.get('/friends', FriendController.viewFriends);
router.post('/friendRequest/:targetUser', FriendController.sendFriend);
router.post('/friend/remove/:targetUser', FriendController.removeFriend);
router.get('/friendRequests/sent', FriendController.viewSentFriendRequests);
router.get('/friendRequests/received', FriendController.viewReceivedFriendRequests);
router.post('/friendRequest/:targetUser/cancel', FriendController.cancelFriendRequest);
router.post('/friendRequest/:targetUser/ignore', FriendController.ignoreFriendRequest);
router.post('/friendRequest/:targetUser/accept', FriendController.acceptFriendRequest);

export default router