import { Router } from 'express'
import { jsonBodyParser } from '../middlewares/jsonBodyParser.js'
import { logic } from '../logic/index.js'
import jwt from 'jsonwebtoken'
import { AuthorizationError } from 'com'

const { JWT_SECRET } = process.env

export const questionsRouter = Router()

questionsRouter.post('/', jsonBodyParser, (request, response, next) => {
    try {
        const authorization = request.headers.authorization
        if (!authorization) throw new AuthorizationError('missing token')

        const token = authorization.slice(7)
        const { sub: userId, role } = jwt.verify(token, JWT_SECRET)

        const { zone, title, body, audioUrl } = request.body

        logic.createQuestion(role, userId, zone, title, body, audioUrl)
            .then(id => response.status(201).json({ id }))
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
})

questionsRouter.get('/', (request, response, next) => {
    try {
        const authorization = request.headers.authorization
        if (!authorization) throw new AuthorizationError('missing token')

        const token = authorization.slice(7)
        const { sub: userId, role } = jwt.verify(token, JWT_SECRET)

        const { zone, search, hasAnswer, page, limit } = request.query

        const parsedHasAnswer = hasAnswer === 'true' ? true : hasAnswer === 'false' ? false : undefined

        logic.getQuestions(role, { zone, search, hasAnswer: parsedHasAnswer, page, limit, studentId: userId })
            .then(questions => response.status(200).json(questions))
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
})

questionsRouter.post('/:questionId/answers', jsonBodyParser, (request, response, next) => {
    try {
        const authorization = request.headers.authorization
        if (!authorization) throw new AuthorizationError('missing token')

        const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : authorization
        const { sub: userId, role } = jwt.verify(token, JWT_SECRET)

        const { questionId } = request.params
        const { text: answerText, audioUrl } = request.body || {}

        logic.answerQuestion(role, questionId, userId, answerText, audioUrl)
            .then(() => response.status(201).send())
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
})
