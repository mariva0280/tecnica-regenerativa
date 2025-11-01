import { data } from '../data'
import { validate, SystemError, errors } from 'com'

export const deleteVideo = (videoId) => {
    validate.videoId(videoId)

    return fetch(import.meta.env.VITE_API_URL + '/videos/' + videoId, {
        method: 'DELETE',
        headers: {
            Authorization: 'Bearer ' + data.getToken(),
            'Content-Type': 'application/json'
        }
    })
        .catch(error => { throw new SystemError('connection error') })
        .then(response => {
            const { status } = response

            if (status === 204) return

            return response.json()
                .catch(error => { throw new SystemError('json error') })
                .then(body => {
                    const { error, message } = body

                    const constructor = errors[error] || SystemError

                    throw new constructor(message)
                })
        })
}