import { connect, disconnect } from '../data/index.js'
import { registerUser } from './registerUser.js'

connect('mongodb://localhost:27017/test-tecnica')
    .then(() => {
        try{
            return registerUser('Isabel Morgado', 'isabel@morgado.com', 'isabelM', '123123123', 'ABC125')
            .then(() => console.log('user registered'))
            .catch(error => console.error(error))
        } catch(error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))
    .finally(() => disconnect())