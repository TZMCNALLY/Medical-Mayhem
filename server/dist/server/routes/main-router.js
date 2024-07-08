"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../auth");
const player_controller_1 = require("../controllers/player-controller");
// Check if the user is logged in before fulfilling any authorized request
router.use(auth_1.auth.verifyToken);
router.get('/getProfile', player_controller_1.PlayerController.getProfile);
router.post('/updateProfile', player_controller_1.PlayerController.updateProfile);
router.get('/recentPlayers', player_controller_1.PlayerController.getRecentPlayers);
router.get('/getAvatar', player_controller_1.PlayerController.getAvatar);
router.post('/updateAvatar', player_controller_1.PlayerController.updateAvatar);
router.get('/settings/get', player_controller_1.PlayerController.getSettings);
router.post('/settings/audio/update', player_controller_1.PlayerController.updateAudioSettings);
router.post('/settings/keybinds/update', player_controller_1.PlayerController.updateKeybinds);
router.post('/settings/toggles/update', player_controller_1.PlayerController.updateToggles);
router.get('/onlinePlayers', player_controller_1.PlayerController.viewOnlinePlayers);
router.post('/relationToUser', player_controller_1.PlayerController.getRelationToUser);
router.post('/blockPlayer', player_controller_1.PlayerController.blockPlayer);
exports.default = router;
//# sourceMappingURL=main-router.js.map