import { connect, disconnect } from "mongoose"
import { getVideos } from "./getVideos.js"

connect('mongodb://localhost:27017/test-tecnica')
    .then(() => {
        try {
            return getVideos()
                .then(videos => console.log('videos', videos))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
    .catch(error => console.error(error))
    .finally(() => disconnect())