import { AuthStudent } from '../data/index.js'
import { validate, SystemError, NotFoundError } from 'com'
import { suspendUserByEmail } from './suspendUserByEmail.js'    

export const deleteAuthStudent = (authStudentId) => {
    validate.userId(authStudentId)

    let removed 

    return AuthStudent.findById(authStudentId)
        .then(doc => {
            if (!doc) throw new NotFoundError('authorized student not found')
            removed = doc    

            return AuthStudent.deleteOne({ _id: authStudentId })
        })
        .then(() => {
            if (removed.used && removed.email) {
                return suspendUserByEmail(removed.email)
            }
        })
        .catch(error => { throw new SystemError('mongo error') })   
}