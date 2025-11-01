import { connect, disconnect } from '../data/index.js'
import { deleteVideo } from './deleteVideo.js'

connect('mongodb://localhost:27017/test-tecnica')
    .then(() => {
        try {
            return deleteVideo('6831e7a7fd98fd111ae2800d')
                .then(() => console.log('video deleted'))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))
    .finally(() => disconnect())    
