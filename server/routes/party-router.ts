import express from 'express';
const router = express.Router();
import { auth } from '../auth';
import { PartyController } from '../controllers/party-controller';

// Check if the user is logged in before fulfilling any authorized request
router.use(auth.verifyToken);

// router.get('/party', PartyController.getParty);
router.get('/party/:username', PartyController.getUserPartyInfo)

export default router