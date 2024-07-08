import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const AvatarSchema = new Schema(
    {
        avatarSprite: {type: String, default: ""},
        avatarName: {type: String, default: ""},
        speed: {type: Number, default: 0},
        strength: {type: Number, default: 0},
        defense: {type: Number, default: 0},
        favoredMinigame: {type: String, default: ""},
        author: {type: String, default: ""},
        comments: [{type: ObjectId, ref: 'Comment'}],
        isPublic: {type: Boolean, default: true},
    },
    { timestamps: true },
)

export const Avatar = mongoose.model('Avatar', AvatarSchema)