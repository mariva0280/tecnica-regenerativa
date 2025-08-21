import { registerUser } from './registerUser'
import { isUserLoggedIn } from './isUserLoggedIn'
import { isUserAdministrator } from './isUserAdministrator'
import { loginUser } from './loginUser'
import { getUserUsername } from './getUserUsername'
import { logoutUser } from './logoutUser'
import { registerAuthStudent } from  './registerAuthStudent'
import { getAllUsers } from './getAllUsers'
import { activeUserByEmail } from './activeUserByEmail'
import { deactivateUserByEmail } from './deactivateUserByEmail'
import { createVideo } from './createVideo'
import { getVideos } from './getVideos'

export const logic = {
    registerUser,
    isUserLoggedIn,
    isUserAdministrator,
    loginUser,
    getUserUsername,
    logoutUser,
    registerAuthStudent,
    getAllUsers,
    activeUserByEmail,
    deactivateUserByEmail,
    createVideo,
    getVideos
}