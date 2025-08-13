import { Router } from 'express'
import { jsonBodyParser } from '../middlewares/jsonBodyParser.js'
import { logic } from '../logic/index.js'
import jwt from 'jsonwebtoken'
import { AuthorizationError } from 'com'

const { JWT_SECRET } = process.env

export const videosRouter = Router()

videosRouter.post('/', jsonBodyParser, (request, response, next) => {
    try{
        const authorization = request.headers.authorization
        if (!authorization) throw new AuthorizationError('missing token')
        
        const token = authorization.slice(7)
        const { role } = jwt.verify(token, JWT_SECRET)
        
        if (role !== 'admin') throw new AuthorizationError('not allowed')

        const { title, description, zone, vimeoId, vimeoHash, isPublished } = request.body
        const published = (isPublished === true || isPublished === 'true')

        logic.createVideo(title, description, zone, vimeoId, vimeoHash, published)
            .then(() => response.status(201).send())
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
})