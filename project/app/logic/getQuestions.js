import { data } from '../data'
import { validate, SystemError, errors } from 'com' 

export const getQuestions = ({ zone, search, page, limit, hasAnswer } = {}) => { 
    const _zone = (typeof zone === 'string' && zone.trim()) ? zone.trim().toLowerCase() : undefined    
    const _search = (typeof search === 'string' && search.trim()) ? search.trim() : undefined

    if (_zone !== undefined) validate.zone(_zone)
    if (_search !== undefined) validate.search(_search)
    if (page !== undefined) validate.page(page) 
    if (limit !== undefined) validate.limit(limit)
    if (hasAnswer !== undefined) validate.boolean(hasAnswer)

    const params = new URLSearchParams()

    if (_zone) params.set('zone', _zone)
    if (_search) params.set('search', _search)
    if (page !== undefined) params.set('page', String(page))
    if (limit !== undefined) params.set('limit', String(limit))
    if (hasAnswer !== undefined) params.set('hasAnswer', String(hasAnswer))

    const url = `${import.meta.env.VITE_API_URL}/questions${params.toString() ? `?${params}` : ''}`    

    return fetch(url, {
        method: 'GET', 
        headers: {
            Authorization: 'Bearer ' + data.token()
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