import { API_BASE } from './apiBase'
import { data } from '../data'
import { validate, SystemError, errors } from 'com'

export const createQuestion = (zone, title, body, audioUrl) => {
    const zoneStr = (zone ?? '').toString().trim().toLowerCase()
    validate.zone(zoneStr)

    const titleStr = typeof title === 'string' ? title.trim() : ''
    if (!titleStr) throw new SystemError('title required')
    validate.title(titleStr)

    const bodyStr = typeof body === 'string' ? body.trim() : ''
    if (!bodyStr) throw new SystemError('question text required')
    validate.questionText(bodyStr)

    let audioStr
    if (audioUrl !== undefined && audioUrl !== null && audioUrl !== '') {
        audioStr = String(audioUrl).trim()
        validate.audioUrl(audioStr)
    }

    const payload = {
        zone: zoneStr,
        title: titleStr,
        body: bodyStr
    }

    if (audioStr) payload.audioUrl = audioStr

    return fetch(API_BASE + '/questions', {
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

            if (status === 201) {
                return response.json()
                    .catch(() => { throw new SystemError('json error') })
                    .then(({ id }) => id)
            }

            return response.json()
                .catch(() => { throw new SystemError('json error') })
                .then(body => {
                    const { error, message } = body

                    const constructor = errors[error] || SystemError

                    throw new constructor(message)
                })
        })
}
