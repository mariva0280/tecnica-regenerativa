import { Video } from '../data/index.js'
import { validate, SystemError, NotFoundError } from 'com'

export const deleteVideo = (videoId) => {
    validate.videoId(videoId)

    return Video.findByIdAndDelete(videoId)
        .then(doc => {
            if (!doc) throw new NotFoundError('video not found')
        })
        .catch(error => { throw new SystemError('mongo error') })
}