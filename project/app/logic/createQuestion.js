import { data } from '../data'
import { validate, SystemError, errors } from 'com'

export const createQuestion = (zone, title, body, audioUrl) => {
    validate.zone(zone)
    if (title !== undefined && title !== null && String(title).trim() !== '') {
        validate.title(title)    
    }

    if (body !== undefined) {
        validate.questionText(body)
    }
    
    if (audioUrl !== undefined && audioUrl !== null && audioUrl !== '') {
        validate.audioUrl(audioUrl)
    }

    const hasTitle = title && title.trim() 
    const hasAudio = audioUrl && audioUrl.trim()

    if (!hasTitle && !hasAudio) {
        throw new Error('title or audioUrl is required')
    }

    return fetch(import.meta.env.VITE_API_URL + '/questions', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + data.getToken(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ zone, title, body, audioUrl })
    })
        .catch(() => { throw new SystemError('connection error') })
        .then(response => {
            const { status } = response

            if (status === 201) {
                return  response.json()
                .catch(error => { throw new SystemError('json error') })
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