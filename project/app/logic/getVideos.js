import { data } from '../data'
import { validate, SystemError, errors } from 'com'

export const getVideos = ({ zone, search, page, limit, onlyPublished } = {}) => {
    if (zone !== undefined) validate.zone(zone)
    if (search !== undefined) validate.search(search)
    if (page !== undefined) validate.page(page) 
    if (limit !== undefined) validate.limit(limit)
    if (onlyPublished !== undefined) validate.boolean(onlyPublished)

    const params = new URLSearchParams()

    if (zone) params.set('zone', String(zone).trim().toLowerCase())
    if (search) params.set('search', String(search).trim())
    if (page !== null) params.set('page', String(page))
    if (limit !== null) params.set('limit', String(limit))
    if (onlyPublished !== undefined) params.set('onlyPublished', String(onlyPublished))

    const url = `${import.meta.env.VITE_API_URL}/videos${params.toString() ? `?${params.toString()}` : ''}`    

    return fetch(url, {
        method: 'GET' 
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