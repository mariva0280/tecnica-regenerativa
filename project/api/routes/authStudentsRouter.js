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