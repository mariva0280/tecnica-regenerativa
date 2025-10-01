import jwt from 'jsonwebtoken'
const { JWT_SECRET } = process.env
import { AuthStudent } from '../data/index.js'
import { validate, SystemError, DuplicityError } from 'com'
import { assertRole } from './helper/authorize.js'

export const registerAuthStudent = (token, email, code) => {
    const { role } = jwt.verify(token, JWT_SECRET)
    assertRole(role, ['admin', 'superadmin'])

    validate.email(email)

    if (code)
        validate.code(code)
    else
        code = Math.random().toString(36).substring(2, 8).toUpperCase()


    return AuthStudent.create({ email, code, used: false })
        .catch(error => {
            if (error.code === 11000) throw new DuplicityError('email already exists in whitelist')

            throw new SystemError('mongo error')
        })

}