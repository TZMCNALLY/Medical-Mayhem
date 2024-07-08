"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import db collections
const index_1 = require("./index");
const user_1 = require("../models/user");
// Creates a user
function userCreate(username, bio) {
    return __awaiter(this, void 0, void 0, function* () {
        const userDetail = {
            username: username,
            bio: bio,
            email: "123@gmail.com",
            passwordHash: "yippee",
            keybinds: new Map(),
            chatVisibility: false,
            gamesPlayed: 0,
            gamesWon: 0,
            highScore: 0,
            patientsSaved: 0,
            winPercent: 0,
            onlineStatus: false,
            appearAsOffline: false,
            dateSinceOnline: new Date(),
            dateRegistered: new Date()
        };
        let user = new user_1.User(userDetail);
        yield user.save();
    });
}
const populate = () => __awaiter(void 0, void 0, void 0, function* () {
    yield userCreate("JareBear", "JareBear's bio :3");
    if (index_1.db)
        index_1.db.close();
    console.log('done');
});
populate()
    .catch((err) => {
    console.log('ERROR: ' + err);
    if (index_1.db)
        index_1.db.close();
});
//# sourceMappingURL=populate.js.map