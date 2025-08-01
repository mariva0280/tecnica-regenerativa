import { connect } from './data/index.js'
import express from 'express'
import cors from 'cors'

const { MONGO_URL_DEV, PORT } = process.env

connect(MONGO_URL_DEV)
    .then(() => {
        const api = express()

        api.use(cors())

        api.get('/hello', (request, response) => {
            response.send('Hello! 👋')
        })

        api.listen(PORT, () => console.log('API listening on port ' + PORT))
    })
    .catch(error => console.error(error))