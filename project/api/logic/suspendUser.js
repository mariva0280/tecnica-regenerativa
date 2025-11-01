import { User } from '../data/index.js'
import { validate, SystemError, NotFoundError } from 'com'
import { assertRole } from './helper/authorize.js'

export const suspendUser = (userId, role) => {
    validate.userId(userId)
    validate.role(role)
    assertRole(role, ['admin', 'superadmin'])

    return User.findById(userId)
        .then(user => {
            if (!user) throw new NotFoundError('user not found')
            if (user.active === false) return

            user.active = false
            return user.save()
        })
        .then(() => {})
        .catch(error => {
            if (error instanceof NotFoundError) throw error

            throw new SystemError('mongo error')
        })
}
