import { registerUser } from './registerUser'
import { isUserLoggedIn } from './isUserLoggedIn'
import { isUserAdministrator } from './isUserAdministrator'
import { loginUser } from './loginUser'
import { getUserUsername } from './getUserUsername'
import { logoutUser } from './logoutUser'
import { registerAuthStudent } from  './registerAuthStudent'
import { createVideo } from './createVideo'

export const logic = {
    registerUser,
    isUserLoggedIn,
    isUserAdministrator,
    loginUser,
    getUserUsername,
    logoutUser,
    registerAuthStudent,
    createVideo
}