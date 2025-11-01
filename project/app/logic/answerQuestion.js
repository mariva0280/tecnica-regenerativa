import { API_BASE } from './apiBase'
import { data } from '../data'
import { validate, SystemError, errors } from 'com'

export const answerQuestion = (questionId, text, audioUrl) => {
    validate.questionId(questionId)

    const trimmedText = typeof text === 'string' ? text.trim() : ''
    if (trimmedText) validate.questionText(trimmedText)

    let trimmedAudio
    if (audioUrl !== undefined && audioUrl !== null && audioUrl !== '') {
        trimmedAudio = String(audioUrl).trim()
        validate.audioUrl(trimmedAudio)
    }

    if (!trimmedText && !trimmedAudio) throw new SystemError('answer required')

    const payload = {}
    if (trimmedText) payload.text = trimmedText
    if (trimmedAudio) payload.audioUrl = trimmedAudio

    return fetch(`${API_BASE}/questions/${questionId}/answers`, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + data.getToken(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .catch(() => { throw new SystemError('connection error') })
        .then(response => {
            const { status } = response
            if (status === 201) return

            return response.json()
                .catch(() => { throw new SystemError('json error') })
                .then(body => {
                    const { error, message } = body
                    const constructor = errors[error] || SystemError
                    throw new constructor(message)
                })
        })
}
