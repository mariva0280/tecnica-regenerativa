import { API_BASE } from './apiBase'
import { data } from '../data'
import { validate, SystemError, errors } from 'com'

export const uploadAudio = (audioFile) => {
    const formData = new FormData()
    formData.append('audio', audioFile)

    return fetch(API_BASE + '/upload-audio', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + data.getToken(),
        },
        body: formData
    })
    .catch(() => { throw new SystemError('audio upload error') })
    .then(response => {
        if (!response.ok) throw new SystemError('audio upload error')
        return response.json()
    })
    .then(result => result.url)
}