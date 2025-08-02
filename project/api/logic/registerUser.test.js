import { connect, disconnect } from '../data/index.js'
import { registerUser } from './registerUser.js'

connect('mongodb://localhost:27017/test-tecnica')
    .then(() => {
        try{
            return registerUser('Vanessa Fdez', 'vanessa@fdez.com', 'vanessaF', '123123123', 'ABC123')
            .then(() => console.log('user registered'))
            .catch(error => console.error(error))
        } catch(error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))
    .finally(() => disconnect())