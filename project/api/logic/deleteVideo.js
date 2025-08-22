import { Video } from '../data/index.js'
import { validate, SystemError, NotFoundError } from 'com'
import { assertRole } from './helper/authorize.js'

export const deleteVideo = (videoId, role) => {
    validate.role(role)
    assertRole(role, ['admin', 'superadmin'])
    validate.videoId(videoId)

    return Video.findByIdAndDelete(videoId)
        .then(doc => {
            if (!doc) throw new NotFoundError('video not found')
        })
        .catch(error => { throw new SystemError('mongo error') })
}