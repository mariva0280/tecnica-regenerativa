import { Video } from '../data/index.js'
import { validate, SystemError, DuplicityError, ValidationError } from 'com'

export const createVideo = (title, description, zone, vimeoId, vimeoHash, isPublished) => {
    validate.title(title)
    validate.description(description)
    validate.zone(zone)
    validate.vimeoId(vimeoId)
    validate.vimeoHash(vimeoHash)
    validate.isPublished(isPublished)

    const doc = {
        title: title.trim(),
        description: (description || '').trim(),
        zone: zone.trim().toLowerCase(),
        vimeoId: vimeoId.trim(),
        vimeoHash: vimeoHash ? vimeoHash.trim() : null,
        isPublished
    }

    return Video.create(doc)
        .catch(error => {
            //console.error('[createVideo] Mongo error: ', error)
            if (error && error.code === 11000) throw new DuplicityError('video already exists')
            
              /*  if (error && error.name === 'Validation Error') throw new ValidationError(error.message)*/
            throw new SystemError('mongo error')    
        })
        .then(() => {})

}