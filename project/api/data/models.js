import mongoose from 'mongoose'
import  { AudioAsset, Attachment, Answer } from './subdocs.js'

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
        enum: ['regular', 'admin', 'curator', 'superadmin'],
        default: 'regular'
    },

    active: {
        type: Boolean,
        default: true
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

// Documento principal Question

const question = new Schema({
    student: {
        type: ObjectId,
        ref: 'User',
        required: true
    },

    zone: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    
    title: {
        type: String,
        required: true,
        trim: true
    },

    body: {
        type: String,
        default: ''
    },

    attachments: {
        type: [Attachment],
        default: []
    },

    answers: {
        type: [Answer],
        default: []
    },

    status: {
        type: String,
        enum: ['open', 'closed', 'answered'],
        default: 'open'
    },

    isPublished: {
        type: Boolean,
        default: true
    },

    tags: [{
        type: String,
        lowercase: true,
        trim: true
    }]
}, {timestamps: true})

question.index({ zone: 1, createdAt: -1 })
question.index({ title: 'text', body: 'text', tags: 1 })


const User = model ('User', user)
const AuthStudent = model ('AuthStudent', authStudent)
const Video = model ('Video', video)
const Question = model ('Question', question)

export {
    User,
    AuthStudent,
    Video,
    Question
}
