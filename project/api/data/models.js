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

const User = model ('User', user)
const AuthStudent = model( 'AuthStudent', authStudent)

export {
    User,
    AuthStudent
}
