import express from 'express';
const router = express.Router();
import { auth } from '../auth';
import { PlayerController } from '../controllers/player-controller';

// Check if the user is logged in before fulfilling any authorized request
router.use(auth.verifyToken);

router.post('/profile/:username', PlayerController.getProfile);
router.post('/updateProfile', PlayerController.updateProfile);
router.get('/recentPlayers', PlayerController.getRecentPlayers);
router.get('/getAvatar', PlayerController.getAvatar);
router.get('/myAvatars', PlayerController.getMyAvatars);
router.post('/updateAvatar', PlayerController.updateAvatar);
router.delete('/deleteAvatar/:id', PlayerController.deleteAvatar);
router.get('/settings/get', PlayerController.getSettings);
router.post('/settings/audio/update', PlayerController.updateAudioSettings);
router.post('/settings/keybinds/update', PlayerController.updateKeybinds);
router.post('/settings/toggles/update', PlayerController.updateToggles);
router.get('/onlinePlayers', PlayerController.viewOnlinePlayers);
router.post('/relationToUser', PlayerController.getRelationToUser);
router.post('/blockPlayer', PlayerController.blockPlayer);

export default router