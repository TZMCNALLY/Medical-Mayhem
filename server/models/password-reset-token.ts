import mongoose from 'mongoose'

const Schema = mongoose.Schema

const PasswordResetTokenSchema = new Schema(
    {
        email: {type: String, required: true},
        token: {type: String, required: true}
    },
    { timestamps: true },
)

export const PasswordResetToken = mongoose.model('PasswordResetToken', PasswordResetTokenSchema)