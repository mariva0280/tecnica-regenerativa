import { registerUser } from './registerUser'
import { isUserLoggedIn } from './isUserLoggedIn'
import { isUserAdministrator } from './isUserAdministrator'
import { loginUser } from './loginUser'
import { registerAuthStudent } from  './registerAuthStudent'

export const logic = {
    registerUser,
    isUserLoggedIn,
    isUserAdministrator,
    loginUser,
    registerAuthStudent
}