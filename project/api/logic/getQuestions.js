import { Question } from '../data/index.js' 
import { validate, SystemError } from 'com'
import { assertRole } from './helper/authorize.js'

const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const getQuestions = (role, { zone, search, hasAnswer, page = 1, limit = 20, studentId } = {}) => {
    assertRole(role, ['regular', 'curator', 'admin', 'superadmin'])

    validate.zone(zone)
    if (search !== undefined) validate.search(search)
    validate.hasAnswer(hasAnswer)
    validate.page(page)
    validate.limit(limit)

    const _page = Number(page) || 1
    const _limit = Math.min(Number(limit) || 20, 100)

    const baseFilters = []

    if (zone) baseFilters.push({ zone: String(zone).trim().toLowerCase() })

    if (search && String(search).trim()) {
        const rx = new RegExp(escapeRegex(String(search).trim()), 'i')
        baseFilters.push({
            $or: [
                { title: rx },
                { body: rx },
                { 'answers.text': rx }
            ]
        })
    }

    const hasAnswerFilter = hasAnswer === true 
        ? { 'answers.0': { $exists: true } } 
        : hasAnswer === false 
            ? { 'answers': { $size: 0 } } 
            : null

    let query 

    if (role === 'admin' || role === 'superadmin') {
        query = { $and: [...baseFilters] }   
    } else {
        const ownBranch = studentId ? { $and: [{ student: studentId }, ...baseFilters]} : null

        const othersBranchAnd = [{ isPublished: true },...baseFilters]
        if (hasAnswerFilter) othersBranchAnd.push(hasAnswerFilter) 
        const othersBranch = { $and: othersBranchAnd }

        if (ownBranch) {
            query = { $or: [ownBranch, othersBranch] }
        } else {
            query = othersBranch
        }
    }
    
    return Question.find(query)
        .sort({ createdAt: -1 })
        .skip((_page - 1) * _limit)
        .limit(_limit)
        .lean()
        .catch(() => { throw new SystemError('mongo error') })
        .then(rows => (rows || []).map(q => {
            const answers = Array.isArray(q.answers) ? q.answers : []
            const publishedOnly = (role === 'regular' || role === 'curator')
            const visibleAnswers = publishedOnly ? answers.filter(a => a?.isPublished) : answers

            return {
                id: String(q._id),
                student: String(q.student),
                zone: q.zone || null,
                title: q.title || '',
                body: q.body || '',
                attachments: q.attachments || [],
                answers: visibleAnswers,
                status: q.status,
                isPublished: q.isPublished,
                createdAt: q.createdAt,
                updatedAt: q.updatedAt
            }
        }))
}