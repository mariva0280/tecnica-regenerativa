import { connect } from './data/index.js'
import express from 'express'
import cors from 'cors'

import { errorHandler } from './middlewares/errorHandler.js'
import { usersRouter } from './routes/usersRouter.js'
import { authStudentsRouter } from './routes/authStudentsRouter.js'
import { videosRouter } from './routes/videosRouter.js'
import { questionsRouter } from './routes/questionsRouter.js'
import { uploadAudioRouter} from './routes/uploadAudioRouter.js'

const { MONGO_URL_DEV, PORT } = process.env

connect(MONGO_URL_DEV)
    .then(() => {
        const api = express()

        api.use(cors())

        api.get('/hello', (request, response) => {
            response.send('Hello! :)')
        })

        api.use('/users', usersRouter)
        api.use('/auth-students', authStudentsRouter)
        api.use('/videos', videosRouter)
        api.use('/questions', questionsRouter)
        api.use('/upload-audio', uploadAudioRouter)
        api.use('/uploads', express.static('uploads')) // Sirve archivos estáticos

        api.use(errorHandler)

        api.listen(PORT, () => console.log('API listening on port ' + PORT))
    })
    .catch(error => console.error(error))
