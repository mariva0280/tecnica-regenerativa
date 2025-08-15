import { Video } from '../data/index.js'
import { validate, SystemError } from 'com'

const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
export const getVideos = (zone, search, page = 1, limit = 20, onlyPublished = false) => {
    validate.zone(zone)
    if (search !== undefined) validate.search(search)
    validate.page(page) 
    validate.limit(limit)
    validate.boolean(onlyPublished)

    const _page = page === undefined ? 1 : Number(page)
    const _limit = limit === undefined ? 20 : Math.min(Number(limit), 100)
    const _onlyPublished = typeof onlyPublished === 'string' ? (onlyPublished === 'true') : !!onlyPublished

    const query = {}

    if (zone) query.zone = String(zone).trim().toLowerCase()
    if (_onlyPublished) query.isPublished = true 

    if (search && String(search).trim()) {
        const rx = new RegExp(escapeRegex(String(search).trim()), 'i')
        query.$or = [{ title: rx }, { description: rx }]
    }    


    return Video.find(query)
        .sort({ createdAt: -1 })
        .skip((_page - 1) * _limit)
        .limit(_limit)
        .lean()
        .then(videos => videos || [])
        .catch(error => { throw new SystemError('mongo error') })        
}
