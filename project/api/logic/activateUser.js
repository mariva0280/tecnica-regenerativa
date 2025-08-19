import { User } from '../data/index.js'
import { validate, SystemError, NotFoundError } from 'com'

export const activateUser = async (userId) => {
    validate.userId(userId)

    try {
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError('user not found')
        
        user.active = true
        await user.save()
    } catch (error) {
        throw new SystemError(error.message)
    }    
    
}