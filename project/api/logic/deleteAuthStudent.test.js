import { connect, disconnect } from '../data/index.js'
import { deleteAuthStudent } from './deleteAuthStudent.js'

connect('mongodb://localhost:27017/test-tecnica')
    .then(() => {
        try {
            return deleteAuthStudent('6831e7a7fd98fd111ae2800d')
                .then(() => console.log('authorized student deleted'))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))
    .finally(() => disconnect())