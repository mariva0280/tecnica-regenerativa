import mongoose from 'mongoose'
import { User } from './models.js'
import { AuthStudent } from './models.js'

const { connect, disconnect } = mongoose

export {
    connect,
    disconnect,

    User,
    AuthStudent
}