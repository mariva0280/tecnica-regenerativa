import { data } from '../data'
import { validate, SystemError, errors } from 'com'

export const deactivateUserByEmail = (email) => {
    validate.email(email)

    return fetch(import.meta.env.VITE_API_URL + '/users/by-email/deactivate', {
        method: 'PATCH',
        headers: {
            Authorization: 'Bearer ' + data.getToken(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .catch(error => { throw new SystemError('connection error') })
    .then(response => {
        const { status } = response
    })
}