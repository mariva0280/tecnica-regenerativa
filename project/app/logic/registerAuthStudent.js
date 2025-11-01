import { data } from '../data/index.js'
import { validate, SystemError, errors } from 'com'

export const registerAuthStudent = (email) => {
    validate.email(email)


    return fetch(import.meta.env.VITE_API_URL + '/auth-students', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + data.getToken(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
        .catch(error => { throw new SystemError('connection error') })
        .then(response => {
            const { status } = response

            if(status === 201) return

            return response.json()
                .catch(error => { throw new SystemError('json error') })
                .then(body => {
                    const { error, message } = body

                    const constructor = errors[error] || SystemError

                    throw new constructor(message)
                })
        })
}