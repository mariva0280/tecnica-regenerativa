import { registerUser } from './registerUser.js'
import { authenticateUser } from './authenticateUser.js'
import { registerAuthStudent } from './registerAuthStudent.js'
import { deleteAuthStudent } from './deleteAuthStudent.js'
import { suspendUser } from './suspendUser.js'
import { suspendUserByEmail } from './suspendUserByEmail.js'
import { activateUser } from './activateUser.js'
import { activateUserByEmail } from './activateUserByEmail.js'
import { getUserUsername } from './getUserUsername.js'
import { getAllUsers } from './getAllUsers.js'
import { createVideo } from './createVideo.js'
import { getVideos } from './getVideos.js'  
import { deleteVideo } from './deleteVideo.js'


export const logic = {
    registerUser,
    authenticateUser,
    registerAuthStudent, 
    deleteAuthStudent,
    suspendUser,
    suspendUserByEmail,
    activateUser,
    activateUserByEmail,
    getUserUsername,
    getAllUsers,
    createVideo,
    getVideos,
    deleteVideo

}