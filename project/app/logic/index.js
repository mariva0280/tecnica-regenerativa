import { registerUser } from './registerUser'
import { isUserLoggedIn } from './isUserLoggedIn'
import { loginUser } from './loginUser'
import { getUserUsername } from './getUserUsername'
import { logoutUser } from './logoutUser'
import { registerAuthStudent } from  './registerAuthStudent'
import { getAllUsers } from './getAllUsers'
import { activeUserByEmail } from './activeUserByEmail'
import { deactivateUserByEmail } from './deactivateUserByEmail'
import { createVideo } from './createVideo'
import { getVideos } from './getVideos'
import { deleteVideo } from './deleteVideo'
import { createQuestion } from './createQuestion'
import { getQuestions } from './getQuestions'
import { uploadAudio } from './uploadAudio'

export const logic = {
    registerUser,
    isUserLoggedIn,
    loginUser,
    getUserUsername,
    logoutUser,
    registerAuthStudent,
    getAllUsers,
    activeUserByEmail,
    deactivateUserByEmail,
    createVideo,
    getVideos,
    deleteVideo,
    createQuestion,
    getQuestions,
    uploadAudio
}