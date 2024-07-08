import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const PartySchema = new Schema(
    {
        users: [{type: ObjectId, ref: 'User'}],
        partyLeader: {type: ObjectId, ref: 'User'},
    },
    { timestamps: true },
)

export const Party = mongoose.model('Party', PartySchema)