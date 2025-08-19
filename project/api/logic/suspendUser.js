import { User } from '../data/index.js'
import { validate, SystemError, NotFoundError } from 'com'

export const suspendUser = (userId) => {
    validate.userId(userId)

    return User.findById(userId)
        .then(user => {
            if (!user) throw new NotFoundError('user not found')
            if (user.active === false) return    
            
            user.active = false
            return user.save()
               
        })
        .catch(error => { throw new SystemError(error.message) })
}