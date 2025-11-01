import path from 'node:path'
import { Question } from '../data/index.js'
import { validate, SystemError, NotFoundError, ValidationError } from 'com'
import { assertRole } from './helper/authorize.js'

export const answerQuestion = (role, questionId, authorId, text, audioUrl) => {
    assertRole(role, ['admin', 'superadmin', 'curator'])

    validate.questionId(questionId)
    validate.userId(authorId)
    validate.role(role)

    const trimmedText = typeof text === 'string' ? text.trim() : ''
    if (trimmedText) validate.questionText(trimmedText)

    const hasAudioInput = typeof audioUrl === 'string' && audioUrl.trim()
    if (hasAudioInput) validate.audioUrl(audioUrl)

    if (!trimmedText && !hasAudioInput) throw new ValidationError('empty answer')

    return Question.findById(questionId)
        .then(question => {
            if (!question) throw new NotFoundError('question not found')

            const existingAnswers = Array.isArray(question.answers) ? question.answers : []
            if (existingAnswers.length > 0) throw new ValidationError('question already answered')

            const answer = {
                author: authorId,
                text: trimmedText,
                isPublished: true
            }

            if (hasAudioInput) {
                const trimmedAudio = audioUrl.trim()
                const storage = /^\/?uploads\//i.test(trimmedAudio) ? 'local' : 'url'
                const ext = path.extname(trimmedAudio).replace('.', '').toLowerCase()

                answer.audio = {
                    storage,
                    url: trimmedAudio,
                    format: ext || 'unknown'
                }
            }

            question.answers.push(answer)
            question.status = 'answered'

            return question.save()
        })
        .then(() => {})
        .catch(error => {
            if (error instanceof NotFoundError || error instanceof ValidationError) throw error

            console.error('[answerQuestion] Mongo error: ', error)
            throw new SystemError('mongo error')
        })
}
