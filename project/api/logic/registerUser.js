import bcrypt from 'bcryptjs'

import { User, AuthStudent } from '../data/index.js'
import { validate, SystemError, DuplicityError, ValidationError } from 'com'

export const registerUser = (name, email, username, password, code) => {
    validate.name(name)
    validate.email(email)
    validate.username(username)
    validate.password(password)

    //Buscar si el alumno está autorizado
    return AuthStudent.findOne({ email, code })
        .then(authStudent => {
            if (!authStudent) throw new ValidationError('Invalid email or code')
            if (authStudent.used) throw new ValidationError('Code already used')
                
            return bcrypt.hash(password, 10)
                .catch(error => { throw new SystemError(error.message) })
                .then(hash => {
                    return User.create({ name, email, username, password: hash, verified: true})
                        .then(() => {
                            authStudent.used = true
                            return authStudent.save()
                        })
                })
        })
        .catch(error => {
            if (error.code === 11000) throw new DuplicityError('Email or username already exists')
            throw new SystemError('mongo error')
        })
}