import axios from 'axios'
import rootDomain from '../../constants/baseURL';

axios.defaults.withCredentials = true;

export const api = axios.create({baseURL: `${rootDomain}/api`})

export const getProfile = async (username) => { return await api.post(`/profile/:username`, {username: username}) }

export const updateProfile = async (bio, pfp) => {
    return api.post(`/updateProfile/`, {
        // SPECIFY THE PAYLOAD
        bio: bio,
        pfp: pfp
    })
}
export const viewFriends = async() => { return await api.get('/friends/'); }

export const sendFriendRequest = async(targetUsername) => { return await api.post('/friendRequest/:targetUsername', {targetUsername: targetUsername}); }

export const removeFriend = async(targetUser) => { return await api.post('/friend/remove/:username', {username: targetUser}); }

export const getRecentPlayers = async() => { return await api.get('/recentPlayers') }

export const viewSentRequests = async() => { return await api.get('/friendRequests/sent'); }

export const viewReceivedRequests = async() => { return await api.get('/friendRequests/received'); }

export const cancelFriendRequest = async(targetUser) => { return await api.post('/friendRequest/:targetUser/cancel', {targetUser: targetUser}); }

export const ignoreFriendRequest = async(targetUser) => { return await api.post('/friendRequest/:targetUser/ignore', {targetUser: targetUser}); }

export const acceptFriendRequest = async(targetUser) => { return await api.post('/friendRequest/:targetUser/accept', {targetUser: targetUser}); }

export const getOnlinePlayers = async() => { return api.get('/onlinePlayers'); }

export const getAvatar = async () => { return await api.get(`/getAvatar/`) }

export const updateAvatar = async (pic, name, speed, strength, defense, favoredMinigame, isPublic, id) => {
    return api.post(`/updateAvatar/`, {
        pic: pic,
        name: name,
        speed: speed,
        strength: strength,
        defense: defense,
        favoredMinigame: favoredMinigame,
        isPublic: isPublic,
        id: id
    });
}

export const updateAvatarList = async (pic, name, speed, strength, defense, favoredMinigame, isPublic, id) => {
    return api.post(`/updateAvatarList/`, {
        pic: pic,
        name: name,
        speed: speed,
        strength: strength,
        defense: defense,
        favoredMinigame: favoredMinigame,
        isPublic: isPublic,
        id: id
    });
}

export const loadAvatar = async (avatar) => { return await api.get(`/avatar/${avatar}`) }

export const deleteAvatar = async(id) => { return api.delete(`/deleteAvatar/${id}`) }

export const getMyAvatars = async () => { return await api.get(`/myAvatars/`) }

export const getAllAvatars = async () => { return await api.get(`/avatars/`) }

export const searchAvatars = async (params) => { return api.get(`/avatars/search/${params}`) }

export const getComments = async (avatar) => { return api.get(`/charactersearch/comments/${avatar}`) }

export const addComment = async(text, targetAvatar) => {
    return api.post('/charactersearch/addComment/', {
        text: text,
        targetAvatar: targetAvatar,
    })
}
export const getSettings = async() => {
    return api.get('/settings/get');
}

export const updateAudioSettings = async(masterVolume, musicVolume, sfxVolume) => {
    return api.post('/settings/audio/update', {
        masterVolume: masterVolume,
        musicVolume: musicVolume,
        sfxVolume: sfxVolume
    })
}

export const updateKeybinds = async({UP, LEFT, DOWN, RIGHT, INTERACT}) => {
    return api.post('/settings/keybinds/update', {
        UP: UP,
        LEFT: LEFT,
        DOWN: DOWN,
        RIGHT: RIGHT,
        INTERACT: INTERACT
    })
}

export const updateToggles = async(privateProfile, toggleChat, toggleParty) => {
    return api.post('/settings/toggles/update', {
        privateProfile: privateProfile,
        toggleChat: toggleChat,
        toggleParty: toggleParty
    })
}

// export const getParty = async() => { return api.get('/party'); }

export const getUserPartyInfo = async(accepter) => { return api.get(`/party/${accepter}`) }

export const getRelationToUser = async(targetUsername) => {
    return api.post('/relationToUser', {targetUsername: targetUsername});
}

export const blockPlayer = async (targetUsername) => { return api.post('/blockPlayer', {targetUsername: targetUsername}); }

export const getPrivateMessages = async() => { return api.get('/messages/private/get')};
export const sendPrivateMessage = async (message) => { return api.post('/messages/private/send', {message: message}); }

const apis = {
    getProfile, updateProfile, // Profile screen

    // Social screen
    removeFriend, viewFriends, sendFriendRequest, getRecentPlayers, viewSentRequests,
    viewReceivedRequests, cancelFriendRequest, ignoreFriendRequest, acceptFriendRequest, getOnlinePlayers,

    // Avatars
    getAvatar, updateAvatar, deleteAvatar, updateAvatarList, getMyAvatars, getAllAvatars, searchAvatars, loadAvatar,
    getComments,
    addComment,
    getSettings,
    updateAudioSettings,
    updateKeybinds,
    updateToggles,
    getUserPartyInfo,
    getRelationToUser,
    blockPlayer,

    // Messages
    getPrivateMessages,
    sendPrivateMessage
}

export default apis