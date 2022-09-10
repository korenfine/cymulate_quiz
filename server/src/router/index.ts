import { Router } from 'express'

import { CymulateService } from '../index'


export default ({ News }: CymulateService) => {
    const router = Router()

    // get news word counter
    router.get('/getNewsWordCounter', News.getCounter)

    // get sources
    router.get('/sources', News.getSources)

    // add news from api
    router.post('/news', News.add)

    return router
}
