import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const PublicChatSchema = new Schema({messages: [{type: ObjectId, ref: 'Message'}]}, { timestamps: true });
export const PublicChat = mongoose.model('PublicChat', PublicChatSchema)