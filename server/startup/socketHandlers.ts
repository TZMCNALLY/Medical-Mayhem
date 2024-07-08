import { Socket } from 'socket.io';
import SocketEvents from '../../client/src/constants/socketEvents'
import { randomBytes } from 'crypto';
import { io } from './index'

class SocketInfo {
    username: string
    socket: Socket
    gameRoom: string
    partyRoom: string

    constructor(socket: Socket, username = '') {
        this.username = username
        this.socket = socket
        this.gameRoom = ''
        this.partyRoom = ''
    }
}

// The queue that will hold all players currently queueing for a game by username
export const queue : Socket[] = []

// Maps socket ids to an object holding info about their state in the app
const socketInfos = new Map<string, SocketInfo>()

export function handleConnection(socket: Socket) {

    // Maps the newly connected socket to an object holding its rooms
    socketInfos.set(socket.id, new SocketInfo(socket))

    socket.on('disconnect', () => {

        if (queue.includes(socket))
            queue.splice(queue.indexOf(socket), 1)

        const socketInfo = socketInfos.get(socket.id) as SocketInfo
        const partyRoom = socketInfo.partyRoom

        socket.leave(socketInfo.partyRoom)
        socket.leave(socketInfo.gameRoom)

        socketInfos.delete(socket.id)

        // Get all users usernames that are in the current room as the disconnecter
        const partyMembers = [...socketInfos.values()].filter(socketInfo => socketInfo.partyRoom == partyRoom)?.map(user => user.username)

        // Let the part members know that the accepter has accepted the invite
        io.to(partyRoom).emit(SocketEvents.UPDATE_PARTY_INFO, {
            partyMembers: partyMembers
        })
    })

    socket.on(SocketEvents.LOGOUT, () => {
        
        if (queue.includes(socket))
            queue.splice(queue.indexOf(socket), 1)

        const socketInfo = socketInfos.get(socket.id) as SocketInfo
        const partyRoom = socketInfo.partyRoom
        
        socket.leave(socketInfo.partyRoom)
        socket.leave(socketInfo.gameRoom)

        socketInfos.delete(socket.id)
        socketInfos.set(socket.id, new SocketInfo(socket))

        // Get all users usernames that are in the current room as the disconnecter
        const partyMembers = [...socketInfos.values()].filter(socketInfo => socketInfo.partyRoom == partyRoom)?.map(user => user.username)

        // Let the part members know that the accepter has accepted the invite
        io.to(partyRoom).emit(SocketEvents.UPDATE_PARTY_INFO, {
            partyMembers: partyMembers
        })
    })

    socket.on(SocketEvents.SET_USERNAME, (data) => {
        (socketInfos.get(socket.id) as SocketInfo).username = data
    })

    socket.on(SocketEvents.QUEUE_UP, (data) => {

        if (queue.length >= 3) {

            // Generate random room number and join it
            let room = randomBytes(8).toString('hex')
            socket.join(room)

            // Update room data structure
            const currSocketInfo = socketInfos.get(socket.id) as SocketInfo
            currSocketInfo.username = data
            currSocketInfo.gameRoom = room

            const players = []
            players.push(currSocketInfo.username)

            // Pop players from queue and add them to the room
            for (let i = 0; i < 3; i++) {
                const teammateSocket = queue.shift() as Socket
                teammateSocket.join(room)

                const currTeammateSocketInfo = socketInfos.get(teammateSocket.id) as SocketInfo
                currTeammateSocketInfo.gameRoom = room

                players.push(currTeammateSocketInfo.username)
            }

            io.to(room).emit(SocketEvents.MATCH_FOUND, {
                players: players
            })
        }
        else {
            queue.push(socket)
        }   
    })

    socket.on(SocketEvents.LEAVE_QUEUE, (data) => {
        if (queue.includes(socket))
            queue.splice(queue.indexOf(socket), 1)
    })

    // PARTY

    socket.on(SocketEvents.PARTY_INVITE, (data) => {

        console.log(data)
        console.log("PARTY INVITE")

        const receiverInfo = [...socketInfos.values()].find(socketInfo => socketInfo.username == data.receiver)

        console.log(receiverInfo)

        if (receiverInfo == undefined) {
            socket.emit(SocketEvents.ERROR, 'User invited no longer exists.')
            return
        }

        socket.to(receiverInfo.socket.id).emit(SocketEvents.PARTY_INVITE, {
            inviter: data.inviter
        })
    })

    socket.on(SocketEvents.PARTY_INVITE_ACCEPTED, async (data) => {

        // Find the inviter's socket info using the given inviter's username
        const inviterInfo = [...socketInfos.values()].find(socketInfo => socketInfo.username == data.inviter)

        if (inviterInfo == undefined) {
            socket.emit(SocketEvents.ERROR, 'User invited no longer exists.')
            return
        }

        // Create a party room for the inviter if no party exists
        if (inviterInfo.partyRoom == '') {
            let room = randomBytes(8).toString('hex')
            inviterInfo.socket.join(room)
            inviterInfo.partyRoom = room
        }

        // Add the accepter to the party room
        const accepterInfo = socketInfos.get(socket.id) as SocketInfo
        let room = inviterInfo.partyRoom
        socket.join(room)
        accepterInfo.partyRoom = room

        // Get all users usernames that are in the current room as the accepter and the inviter
        const partyMembers = [...socketInfos.values()].filter(socketInfo => socketInfo.partyRoom == room)?.map(user => user.username)

        // Let the party members know that the accepter has accepted the invite
        io.to(room).emit(SocketEvents.UPDATE_PARTY_INFO, {
            partyMembers: partyMembers,
        })
    })

    // data is an array of usernames
    socket.on(SocketEvents.CHANGE_READY, (data) => {
        io.to((socketInfos.get(socket.id) as SocketInfo).partyRoom).emit(SocketEvents.CHANGE_READY, data)
    })

    // data is an array of usernames that will be matched up to play.
    // This event listener gets executed when a user tells the server everyone in the party is ready.
    // This listener assumes that all users received in the data actually exist in the socketInfos map.
    socket.on(SocketEvents.MATCH_FOUND, (data) => {

        // console.log("socketInfos: " + JSON.stringify(socketInfos))
        console.log("data: " + JSON.stringify(data))
        
        // For each player, set their game room to the same
        let room = randomBytes(8).toString('hex')

        for (const player of data.players) {
            const userInfo = [...socketInfos.values()].find(socketInfo => socketInfo.username === player)
            
            if (userInfo === undefined) throw new Error("ayo wtf " + player + " is supposed to exist in socketInfos")

            console.log(userInfo)
            userInfo.gameRoom = room
            userInfo.socket.join(room)
        }

        io.to(room).emit(SocketEvents.MATCH_FOUND, data)
    })

    socket.on(SocketEvents.LEAVE_PARTY, (data) => {

        // Clear the old party room id
        const oldPartyRoom = (socketInfos.get(socket.id) as SocketInfo).partyRoom;
        (socketInfos.get(socket.id) as SocketInfo).partyRoom = ''

        // Leave the party
        socket.leave(oldPartyRoom)

        // Let everyone know in the old party that the user left with the new members structure
        socket.to(oldPartyRoom).emit(SocketEvents.UPDATE_PARTY_INFO, {
            partyMembers: data.partyMembers
        })
    })

    // GAMEPLAY

    // data is a player username, and a vec
    socket.on(SocketEvents.PLAYER_MOVED, (data) => {
        io.to((socketInfos.get(socket.id) as SocketInfo).gameRoom).emit(SocketEvents.PLAYER_MOVED, data)
    })

    // data is a player username
    socket.on(SocketEvents.STOP_FOLLOW, (data) => {
        io.to((socketInfos.get(socket.id) as SocketInfo).gameRoom).emit(SocketEvents.STOP_FOLLOW, data)
    })

    // data is a player username and a patient
    socket.on(SocketEvents.TREAT_PATIENT, (data) => {
        io.to((socketInfos.get(socket.id) as SocketInfo).gameRoom).emit(SocketEvents.TREAT_PATIENT, data)
    })

    // data is a patient id
    socket.on(SocketEvents.START_TREAT_PATIENT, (data) => {
        io.to((socketInfos.get(socket.id) as SocketInfo).gameRoom).emit(SocketEvents.START_TREAT_PATIENT, data)
    })

    // data is a patient id
    socket.on(SocketEvents.SPAWN_PATIENT, (data) => {
        io.to((socketInfos.get(socket.id) as SocketInfo).gameRoom).emit(SocketEvents.SPAWN_PATIENT, data)
    })

    // MESSAGES
    socket.on(SocketEvents.SEND_PUBLIC_MESSAGE, data => io.emit(SocketEvents.RECEIVE_PUBLIC_MESSAGE, data));
    socket.on(SocketEvents.SEND_PARTY_MESSAGE, data => io.to((socketInfos.get(socket.id) as SocketInfo).partyRoom).emit(SocketEvents.RECEIVE_PARTY_MESSAGE, data));
    socket.on(SocketEvents.SEND_PRIVATE_MESSAGE, data => { })
}