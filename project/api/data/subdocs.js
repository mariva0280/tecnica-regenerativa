import mongoose from 'mongoose'

const { Schema, model } = mongoose
const { Types } = Schema
const { ObjectId } = Types

 export const AudioAsset = new Schema({
    storage: {
        type: String,
        enum: ['local', 'cloudinary', 's3'],
        required: true
    },

    url: {
        type: String,
        required: true
    },

    key: {
        type: String
    },

    format: {
        type: String,
        default: 'mp3'
    },

    durationSec: {
        type: Number
    },

    sizeBytes: {
        type: Number
    }
}, { _id: false })

// Subdoc adjunto de la pregunta

export const Attachment = new Schema({
    type: {
        type: String,
        enum: ['audio', 'image'],
        required: true
    },

    audio: {
        type: AudioAsset
    },

    url: {
        type: String
    }

}, { _id: true })

// Subdoc respuesta embebida en Question

export const Answer = new Schema({
    author: {
        type: ObjectId,
        ref: 'User',
        required: true
    },

    text: {
        type: String,
        default: ''
    },

    audio: {
        type: AudioAsset
    },

    isPublished: {
        type: Boolean,
        default: true
    }
}, { timestamps })
