import { Router } from 'express'
import { jsonBodyParser } from '../middlewares/jsonBodyParser.js'
import { logic } from '../logic/index.js'
import jwt from 'jsonwebtoken'
import { AuthorizationError } from 'com'

const { JWT_SECRET } = process.env

export const authStudentsRouter = Router()

authStudentsRouter.post('/', jsonBodyParser, (request, response, next) => {
    try {
        const { email, code } = request.body

        logic.registerAuthStudent(email, code)
            .then(() => response.status(201).send())
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
})

authStudentsRouter.delete('/:id', (request, response, next) => {
    try {
        const authorization = request.headers.authorization
        if (!authorization) throw new AuthorizationError('missing token')
        
        const token = authorization.slice(7)
        const { role } = jwt.verify(token, JWT_SECRET)
        
        if (role !== 'admin') throw new AuthorizationError('not allowed')

        const { id } = request.params  

        logic.deleteAuthStudent(id)
            .then(() => response.status(204).send())
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
})