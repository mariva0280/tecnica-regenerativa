import { assertRole } from './helper/authorize.js'
import { User } from '../data/index.js'
import { validate, SystemError } from 'com'

export const getAllUsers = ({ search, role: roleFilter, active, page = 1, limit = 20} = {}, role) => {
    validate.role(role)
    assertRole(role, ['admin', 'superadmin'])

    if (search !== undefined) validate.search(search)
    if (roleFilter !== undefined) validate.role(roleFilter) 
    if (active !== undefined) validate.boolean(active)
    if (page !== undefined) validate.page(page)  
    if (limit !== undefined) validate.limit(limit)

    const query = {}  
    if (search && search.trim()) {
        const rx = new RegExp(search.trim(), 'i')
        query.$or = [{ name: rx }, { username: rx }, { email: rx }]
    }  

    if (roleFilter) query.role = roleFilter
    if (active !== undefined) query.active = (active === 'true' || active === true)


    const _page = Number(page) || 1
    const _limit = Math.min(Number(limit) ||20, 100)

    const projection = { name: 1, email: 1, role: 1, active: 1 }

    return User.find(query, projection)
        .sort({ createdAt: -1 })
        .skip((_page - 1) * _limit)
        .limit(_limit)
        .lean()
        .then(users => users || [])
        .catch(error => { throw new SystemError('mongo error') })  
}