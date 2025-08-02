import { connect, disconnect } from '../data/index.js'
import { registerAuthStudent } from './registerAuthStudent.js'

connect('mongodb://localhost:27017/test-tecnica')
    .then(() => {
        try {
            return registerAuthStudent('vanessa@fdez.com', 'ABC123')
            .then(() => console.log('authorized student'))
            .catch(error => console.error(error))
        } catch(error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))
    .finally(() => disconnect())