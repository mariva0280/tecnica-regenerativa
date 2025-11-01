import { data } from '../data'
import { validate, SystemError, errors } from 'com'

export const getAllUsers = ({ search, role, active, page = 1, limit = 20 } = {}) => {
    if (search !== undefined) validate.search(search)
    if (role !== undefined) validate.role(role) 
    if (active !== undefined) validate.boolean(active)
    if (page !== undefined) validate.page(page)  
    if (limit !== undefined) validate.limit(limit)

    const params = new URLSearchParams()

    if (search) params.append('search', String(search).trim())
    if (role) params.append('role', String(role).trim())
    if (active !== undefined) params.append('active', String(active))
    if (page) params.append('page', String(page))
    if (limit) params.append('limit', String(limit))

    const url = `${import.meta.env.VITE_API_URL}/users${params.toString() ? `?${params}` : ''}`    

    return fetch(url, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + data.getToken()
        }
    })
        .catch(error => { throw new SystemError('connection error') })
        .then(response => {
            const { status } = response

            if (status === 200) return response.json()
            
            return response.json()
                .catch(error => { throw new SystemError('json error') })
                .then(body => {
                    const { error, message } = body

                    const constructor = errors[error] || SystemError

                    throw new constructor(message)                      
                })    
        })
}