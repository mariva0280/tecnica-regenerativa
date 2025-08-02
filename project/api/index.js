import { connect } from './data/index.js'
import express from 'express'
import cors from 'cors'

import { usersRouter } from './routes/usersRouter.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { authStudentsRouter } from './routes/authStudentsRouter.js'

const { MONGO_URL_DEV, PORT } = process.env

connect(MONGO_URL_DEV)
    .then(() => {
        const api = express()

        api.use(cors())

        api.get('/hello', (request, response) => {
            response.send('Hello! 👋')
        })

        api.use('/users', usersRouter)
        api.use('/auth-students', authStudentsRouter)

        api.use(errorHandler)

        api.listen(PORT, () => console.log('API listening on port ' + PORT))
    })
    .catch(error => console.error(error))