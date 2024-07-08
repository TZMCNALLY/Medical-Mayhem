import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const FriendRequestSchema = new Schema(
    {
        sender: {type: ObjectId, ref: 'User'},
        receiver: {type: ObjectId, ref: 'User'},
        date: {type: Date, default: new Date()},
    },
    { timestamps: true },
)

export const FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema)