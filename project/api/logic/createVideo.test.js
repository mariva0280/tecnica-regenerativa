import { connect, disconnect } from '../data/index.js'
import { createVideo } from './createVideo.js'

connect('mongodb://localhost:27017/test-tecnica')
    .then(() => {
        try {
            return createVideo('Manos','Evaluación clinica','manos','123456789',null, true)
                .then(() => console.log('Video created'))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))
    .finally(() => disconnect())