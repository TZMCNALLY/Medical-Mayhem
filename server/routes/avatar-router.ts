import express from 'express'
const router = express.Router()
import { AvatarController } from '../controllers/avatar-controller'

// router.use(auth.verifyToken)

router.get('/avatar/:avatar', AvatarController.loadAvatar);
router.get('/avatars', AvatarController.getAllAvatars);
router.get('/avatars/search/:params', AvatarController.searchAvatars);
router.post('/updateAvatarList', AvatarController.updateAvatarList);
router.get('/charactersearch/comments/:avatar', AvatarController.getComments);
router.post('/charactersearch/addComment', AvatarController.addComment);

export default router