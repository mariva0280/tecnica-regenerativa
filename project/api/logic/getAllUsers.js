import { User } from '../data/index.js'
import { SystemError } from 'com'

const escapeRx = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const getAllUsers = ({ search, role, active, page = 1, limit = 20} = {}) => {
    const _page = Number(page) || 1
    const _limit = Math.min(Number(limit) ||20, 100)

    const query = {}

    if (role) query.role = String(role).toLowerCase()
    if (active !== undefined) query.active = (String(active) === 'true')

    if (search && String(search).trim()) {
        const rx = new RegExp(escapeRx(String(search).trim()), 'i')
        query.$or = [{ name: rx }, { username: rx }, { email: rx }]
    }

    const projection = { name: 1, email: 1, role: 1, active: 1 }

    return User.find(query, projection)
        .sort({ createdAt: -1 })
        .skip((_page - 1) * _limit)
        .limit(_limit)
        .lean()
        .then(users => users || [])
        .catch(error => { throw new SystemError('mongo error') })  
}