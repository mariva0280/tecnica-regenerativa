import { Router } from 'express'
import { jsonBodyParser } from '../middlewares/jsonBodyParser.js'
import { logic } from '../logic/index.js'
import jwt from 'jsonwebtoken'
import { AuthorizationError } from 'com'

const { JWT_SECRET } = process.env

export const usersRouter = Router()

usersRouter.post('/', jsonBodyParser, (request, response, next) => {
    try{
        const { name, email, username, password, code } = request.body

        logic.registerUser(name, email, username, password, code)
            .then(() => response.status(201).send())
            .catch(error => next(error))
    } catch(error) {
        next(error)
    }
})