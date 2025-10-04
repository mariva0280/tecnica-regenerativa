import { ValidationError } from './errors.js'

export const validate = {
    name(name) {
        if (typeof name !== 'string') throw new ValidationError('invalid name type')
        if (name.length < 1) throw new ValidationError('invalid name min length')
        if (name.length > 30) throw new ValidationError('invalid name max length')
    },

    email(email) {
        if (typeof email !== 'string') throw new ValidationError('invalid email type')
        if (email.length < 6) throw new ValidationError('invalid email min length')
        if (email.length > 30) throw new ValidationError('invalid email max length')
    },

    username(username) {
        if (typeof username !== 'string') throw new ValidationError('invalid username type')
        if (username.length < 3) throw new ValidationError('invalid username min length')
        if (username.length > 20) throw new ValidationError('invalid username max length')
    },

    password(password) {
        if (typeof password !== 'string') throw new ValidationError('invalid password type')
        if (password.length < 8) throw new ValidationError('invalid password min length')
        if (password.length > 20) throw new ValidationError('invalid password max length')
    },

    userId(userId) {
        if (typeof userId !== 'string') throw new ValidationError('Invalid userId type.')
        if (userId.length !== 24) throw new ValidationError('Invalid userId length.')
    },

    code(code) {
        if (typeof code !== 'string') throw new ValidationError('Invalid code type')
        if (code.length < 4) throw new ValidationError('Invalid code min length')
        if (code.length > 12) throw new ValidationError('Invalid code max length')        
    },

    title(title) {
        if (typeof title !== 'string' || !title.trim()) throw new ValidationError('Invalid title')
        if (title.length > 120) throw new ValidationError('Invalid title max length')    
    },

    description(description) {
        if (typeof description !== 'string') throw new ValidationError('Invalid description type')
        if (description == null) throw new ValidationError('Invalid description')   
        if (description.length > 1500) throw new ValidationError('Invalid description max length')     
    },

    zone(zone) {
        if (zone === undefined) return
        if (typeof zone !== 'string') throw new ValidationError('Invalid zone type')
        if (!zone.trim()) throw new ValidationError('Invalid zone') 
        if (zone.length > 50) throw new ValidationError('Invalid zone max length')       
    },

    vimeoId(vimeoId) {
        if (typeof vimeoId !== 'string') throw new ValidationError('Invalid vimeoId type')
        if (!vimeoId.trim()) throw new ValidationError('Invalid vimeoId')
        if (!/^\d{6,12}$/.test(vimeoId)) throw new ValidationError('invalid vimeoId format')       
    },

    vimeoHash(vimeoHash) {
        if (vimeoHash == null || vimeoHash === '') return
        if (typeof vimeoHash !== 'string') throw new ValidationError('invalid vimeoHash type')
    },

    isPublished(isPublished) {
        if (typeof isPublished !== 'boolean') throw new ValidationError('invalid isPublished type')
    },

    videoId(videoId) {
        if (typeof videoId !== 'string') throw new ValidationError('invalid videoId type')
        if (!/^[0-9a-fA-F]{24}$/.test(videoId)) throw new ValidationError('invalid videoId length')
    },

    page(page) {
        if (page === undefined) return
        if (typeof page === 'string') {
            if (!/^\d+$/.test(page)) throw new ValidationError('invalid page type')
            page = Number(page)
        }
        if (typeof page !== 'number') throw new ValidationError('invalid page type')
        if (!Number.isInteger(page) || page < 1) throw new ValidationError('invalid page min value')
    },

    limit(limit) {
        if (limit === undefined) return
        if (typeof limit === 'string') {
            if (!/^\d+$/.test(limit)) throw new ValidationError('invalid limit type')
            limit = Number(limit)
        }
        if (typeof limit !== 'number') throw new ValidationError('invalid limit type')
        if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new ValidationError('invalid limit value')
    },

    search(search) {
        if (search === undefined) return
        if (typeof search !== 'string') throw new ValidationError('invalid search type')
        if (!search.trim()) throw new ValidationError('invalid search value')
    },

    boolean(value) {
        if (value === undefined) return
        if (typeof value === 'boolean') return
        if (typeof value === 'string' && (value === 'true' || value === 'false')) return
        throw new ValidationError('invalid boolean value')
    },

    role(role) {
        if (role === undefined) return
        if (typeof role !== 'string') throw new ValidationError('invalid role type')
        const allowed = ['regular', 'admin', 'superadmin', 'curator']
        if (!allowed.includes(role)) throw new ValidationError('invalid role value')
    },

    questionText(text) {
        if  (text === undefined) return
        if (typeof text !== 'string') throw new ValidationError('invalid question text type')
        if (!text.trim()) throw new ValidationError('invalid question text value')
        if (text.length > 2000) throw new ValidationError('invalid question text max length')    
    },

    audioUrl(url) {
        if (url === undefined || url === null || url === '') return
        if (typeof url !== 'string') throw new ValidationError('invalid audio url type')
        const trimmed = url.trim()
        const isHttp = /^https?:\/\//i.test(trimmed)
        const isLocal = /^\/?uploads\//i.test(trimmed)
        if (!isHttp && !isLocal) throw new ValidationError('invalid audio url')
    },

    hasAnswer(value) {
        if (value === undefined) return
        if (typeof value === 'boolean') return
        if (typeof value === 'string' && (value === 'true' || value === 'false')) return
        throw new ValidationError('invalid hasAnswer value')
    }
}