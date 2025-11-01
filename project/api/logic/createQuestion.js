import { Question } from '../data/index.js'
import { validate, SystemError } from 'com'
import path from 'node:path'
import { assertRole } from './helper/authorize.js'

export const createQuestion = (role, studentId, zone, title, body, audioUrl) => {
    assertRole(role, ['curator', 'admin', 'superadmin', 'regular'])

    validate.userId(studentId)
    validate.zone(zone)

    const trimmedTitle = typeof title === 'string' ? title.trim() : ''
    const hasTitle = !!trimmedTitle
    if (hasTitle) validate.title(trimmedTitle)

    const hasBodyInput = body !== undefined && body !== null
    const trimmedBody = hasBodyInput && typeof body === 'string' ? body.trim() : ''
    if (trimmedBody) validate.questionText(body)

    const hasAudioInput = typeof audioUrl === 'string' && audioUrl.trim()
    if (hasAudioInput) validate.audioUrl(audioUrl)

    if (!hasTitle && !hasAudioInput) throw new SystemError('empty question')

    const normalizedZone = zone.trim().toLowerCase()

    const doc = {
        student: studentId,
        zone: normalizedZone,
        title: trimmedTitle,
        body: trimmedBody,
        attachments: [],
        answers: [],
        status: 'open',
        isPublished: true
    }

    if (hasAudioInput) {
        const trimmedAudio = audioUrl.trim()
        const storage = /^\/?uploads\//i.test(trimmedAudio) ? 'local' : 'url'
        const ext = path.extname(trimmedAudio).replace('.', '').toLowerCase()

        doc.attachments.push({
            type: 'audio',
            audio: {
                storage,
                url: trimmedAudio,
                format: ext || 'unknown'
            }
        })
    }

    return Question.create(doc)
        .then(question => question.id)
        .catch(error => {
            console.error('[createQuestion] Mongo error: ', error)
            throw new SystemError('mongo error')
        })
}
