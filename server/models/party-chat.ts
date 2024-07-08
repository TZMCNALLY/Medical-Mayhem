import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const PartyChatSchema = new Schema(
    {
        users: [{type: ObjectId, ref: 'User'}],
        messages: [{type: ObjectId, ref: 'Message'}],
    },
    { timestamps: true },
)

export const PartyChat = mongoose.model('PartyChat', PartyChatSchema)