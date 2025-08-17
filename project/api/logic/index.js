import { registerUser } from './registerUser.js'
import { authenticateUser } from './authenticateUser.js'
import { registerAuthStudent } from './registerAuthStudent.js'
import { deleteAuthStudent } from './deleteAuthStudent.js'
import { suspendUserByEmail } from './suspendUserByEmail.js'
import { getUserUsername } from './getUserUsername.js'
import { createVideo } from './createVideo.js'
import { getVideos } from './getVideos.js'  
import { deleteVideo } from './deleteVideo.js'

export const logic = {
    registerUser,
    authenticateUser,
    registerAuthStudent, 
    deleteAuthStudent,
    suspendUserByEmail,
    getUserUsername,
    createVideo,
    getVideos,
    deleteVideo

}