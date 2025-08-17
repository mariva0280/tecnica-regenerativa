import { User } from '../data/index.js'
import { validate, SystemError, NotFoundError } from 'com'

export const suspendUserByEmail = (email) => {
    validate.email(email)

    return User.findOneAndUpdate({ email }, { $set: { active: false } }, { new: true })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')
        })
        .catch(error => { throw new SystemError('mongo error') })
}