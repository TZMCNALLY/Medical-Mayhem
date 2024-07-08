"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../auth");
const party_controller_1 = require("../controllers/party-controller");
// Check if the user is logged in before fulfilling any authorized request
router.use(auth_1.auth.verifyToken);
router.get('/party', party_controller_1.PartyController.getParty);
exports.default = router;
//# sourceMappingURL=party-router.js.map