import { request, Router } from 'express'
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

usersRouter.post('/auth', jsonBodyParser, (request, response, next) => {
    try{
        const { username, password } = request.body

        logic.authenticateUser(username, password)
            .then(user => {
                const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })

                response.status(200).json(token)
            })
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
})

usersRouter.get('/self/username', (request, response, next) => {
    try {
        const authorization = request.headers.authorization
        if (!authorization) throw new AuthorizationError('missing token')
        
        const token = authorization.slice(7)
        const { sub: userId } = jwt.verify(token, JWT_SECRET)

        logic.getUserUsername(userId)
            .then(username => response.status(200).json(username))
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
})

usersRouter.patch('/:userId/activate', (request, response, next) => {
    try {
        const authorization = request.headers.authorization
        if (!authorization) throw new AuthorizationError('missing token')

        const token = authorization.slice(7)
        const { role } = jwt.verify(token, JWT_SECRET)

        const { userId } = request.params

        logic.activateUser(userId, role)
            .then(() => response.status(204).send())
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
})

usersRouter.patch('/by-email/activate', jsonBodyParser, (request, response, next) => {
    try {
        const authorization = request.headers.authorization
        if (!authorization) throw new AuthorizationError('missing token')
        const token = authorization.slice(7)
        const { role } = jwt.verify(token, JWT_SECRET)

        const { email } = request.body

        logic.activateUserByEmail(email, role)
            .then(() => response.status(204).send())
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
})

usersRouter.patch('/:userId/suspend', (request, response, next) => {
    try {
        const authorization = request.headers.authorization
        if (!authorization) throw new AuthorizationError('missing token')

        const token = authorization.slice(7)
        const { role } = jwt.verify(token, JWT_SECRET)

        const { userId } = request.params

        logic.suspendUser(userId, role)
            .then(() => response.status(204).send())
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
})

usersRouter.patch('/by-email/suspend', jsonBodyParser, (request, response, next) => {
    try {
        const authorization = request.headers.authorization
        if (!authorization) throw new AuthorizationError('missing token')
        const token = authorization.slice(7)
        const { role } = jwt.verify(token, JWT_SECRET)

        const { email } = request.body

        logic.suspendUserByEmail(email, role)    
            .then(() => response.status(204).send())    
            .catch(error => next(error))    
    } catch (error) {
        next(error)
    }
})

usersRouter.get('/', (request, response, next) => {
    try {
        const authorization = request.headers.authorization
        if (!authorization) throw new AuthorizationError('missing token')
        
        const token = authorization.slice(7)
        const { role } = jwt.verify(token, JWT_SECRET)

        const { search, role: roleFilter, active, page, limit } = request.query

        logic.getAllUsers({ search, role: roleFilter, active, page, limit }, role)
            .then(users => response.status(200).json(users))
            .catch(error => next(error))
    } catch(error) {
        next(error)
    }
})
