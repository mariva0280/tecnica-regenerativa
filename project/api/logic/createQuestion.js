import { Question } from '../data/index.js'
import { validate, SystemError, AuthorizationError } from 'com'
import { assertRole } from './helper/authorize.js'

export const createQuestion = (role, studentId, zone, title, body, audioUrl) => {
    assertRole(role, ['curator', 'admin', 'superadmin', 'regular'])

    validate.userId(studentId)
    validate.zone(zone)
    validate.title(title)
    if (body !== undefined) {
    validate.questionText(body)
    }
    if (audioUrl !== undefined && audioUrl !== null && audioUrl !== '') {
    validate.audioUrl(audioUrl)
    }

    const hasTitle = !!String(title).trim()
    const hasAudio = typeof audioUrl === 'string' && audioUrl.trim()
    if (!hasTitle && !hasAudio) throw new SystemError('empty question')

    const doc = {
        student: studentId,
        zone: zone.trim().toLowerCase(),
        title: title.trim(),
        body: (body || '').trim(),
        attachments: [],
        answers: [],
        status: 'open',
        isPublished: true
    }

    if (hasAudio) {
        doc.attachments.push({
            type: 'audio',
            audio: {
                storage: 'url',
                url: audioUrl.trim(),
                format: 'mp3'
            }
        })
    }

    return Question.create(doc)
        .then(question => question.id)
        .catch(error => { 
            console.error('[createQuestion] Mongo error: ', error)
            throw new SystemError('mongo error') })
      
}