require('dotenv').config()
import express from 'express'
import bodyParser from 'body-parser'
import { createServer } from "http";
import cors from 'cors'

import router from './router'

// services
import { DbService } from './service/db'

// controllers
import  { NewsService, NewsController } from './controllers/news'

const app = express()
const port = 8080

app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json())

const httpServer = createServer(app);

// dependencies
const db = new DbService()

// services
export interface CymulateService {
    News: NewsService,
}

const CS: CymulateService = {
    News: NewsController({ db }),
}
app.use('/api', router(CS))

httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
