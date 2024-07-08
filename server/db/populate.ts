// Import db collections
import { db } from './index';
import { User } from '../models/user';

// Creates a user
async function userCreate(username: String, bio: String) {
    const userDetail = {
        username: username,
        bio: bio,
        email: "123@gmail.com",
        passwordHash: "yippee",
        keybinds: new Map<string, number>(),
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
    }
    let user = new User(userDetail);
    await user.save();
}

const populate = async () => {
    await userCreate("JareBear", "JareBear's bio :3");
    if(db) db.close();
    console.log('done');
}

populate()
    .catch((err: Error) => {
        console.log('ERROR: ' + err);
        if(db) db.close();
    });