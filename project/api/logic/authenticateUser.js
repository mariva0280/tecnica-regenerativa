import bcrypt from 'bcryptjs'

import { User } from '../data/index.js'
import { validate, SystemError, CredentialsError, NotFoundError, AuthorizationError } from 'com'

export const authenticateUser = (username, password) => {
    validate.username(username)
    if (typeof password !== 'string' || password.length === 0) {
        throw new CredentialsError('wrong password')
    }

    return User.findOne({ username })
        .catch(error => { throw new SystemError('mongo error') })
        .then(user => {
            if(!user) throw new NotFoundError('user not found')
            if (user.active === false) throw new AuthorizationError('account disabled')    

            return bcrypt.compare(password, user.password)
                .catch(error => { throw new SystemError(error.message) })
                .then(match => {
                    if (!match) throw new CredentialsError('wrong password')

                    return { id: user.id, role: user.role}    
                })    
        })
}
