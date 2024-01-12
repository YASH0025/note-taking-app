import * as mongoose from 'mongoose'

const UrlSchema = new mongoose.Schema({
    filename: String,
    mimetype: String,
    encoding: String,
    path: String
})

export const TaskSchema = new mongoose.Schema(
    {
        title: String,
        description: { type: String, default:'' },
        userId: String,
        urls: [UrlSchema],
        category: String
    },
    { timestamps: true }
)
