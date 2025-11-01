import mongoose from 'mongoose'
import { User } from './models.js'

const { connect, disconnect } = mongoose

connect('mongodb://localhost:27017/test-tecnica')
    .then(() => {
        return User.findById('68a83afe59ae2ff4644776ea')
            .catch(error => { throw new Error(error.message) })
            .then(user => {
                user.role = 'admin'

                return user.save()
                    .catch(error => { throw new Error(error.message) })
            })
            .then(() => console.log('roles set'))
    })
    .catch(error => console.error(error))
    .finally(() => disconnect())