import mongoose from 'mongoose'
import { User } from './models.js'

const { connect, disconnect } = mongoose

connect('mongodb://localhost:27017/test-tecnica')
    .then(() => {
        return User.findById('68a83b59b75c2a6db493a157')
            .catch(error => { throw new Error(error.message) })
            .then(user => {
                user.role = 'curator'

                return user.save()
                    .catch(error => { throw new Error(error.message) })
            })
            .then(() => console.log('roles set'))
    })
    .catch(error => console.error(error))
    .finally(() => disconnect())