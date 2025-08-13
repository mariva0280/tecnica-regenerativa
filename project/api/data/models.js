import mongoose from 'mongoose'

const { Schema, model } = mongoose
const { Types } = Schema
const { ObjectId } = Types

const user = new Schema ({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    verified: {
        type: Boolean,
        default: false
    },

    role: {
        type: String,
        required: true,
        enum: ['regular', 'admin'],
        default: 'regular'
    }

}, { timestamps: true })

const authStudent = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    used: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const video = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        trim: true,
        default:''
    },

    zone: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    vimeoId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    vimeoHash: {
        type: String,
        trim: true,
        default: null
    },

    isPublished: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

const User = model ('User', user)
const AuthStudent = model ('AuthStudent', authStudent)
const Video = model ('Video', video)

export {
    User,
    AuthStudent,
    Video
}
