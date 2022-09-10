import {Request, Response} from 'express'
import moment from 'moment'

import feedAxios from '../service/feedAxios'
import { DbServiceInterface } from '../service/db'

export interface NewsService {
    getCounter(req: Request, res: Response): void
    getSources(req: Request, res: Response): void
    add(req: Request, res: Response): void
}

const API_KEY = '817de99214ad48069d07a27e3aa0e29a'
export const NewsController = ({ db }: { db: DbServiceInterface }): NewsService => {
    /**
     * get articles title and description counter
     **/
    const getCounter = async (req: Request, res: Response) => {
        const articles = await db.find('articles', {})

        const wordsCount = articles.reduce((arr: any, article: any) =>
            [...arr, { count: article.titleWordCount + article.titleDescCount }]
        , [])
        res.send({ wordsCount })
    }

    /**
     * get all news source
     **/
    const getSources = async (req: Request, res: Response) => {
        const path = `v2/top-headlines/sources?apiKey=${API_KEY}`
        const sourcesRes: any = await feedAxios.get(path)

        const sources = sourcesRes.sources.map((source: any) => ({ id: source.id, name: source.name }))
        res.send({ sources })
    }

    /**
     * add news according to source and date
     **/
    const add = async (req: Request, res: Response) => {
        try {
            const { source, from, to } = req.body
            let path = `v2/everything?language=en&sortBy=publishedAt&sources=${source}&apiKey=${API_KEY}`

            const fromDate = moment(from)
            const toDate = moment(to)

            const promises = []
            while(toDate.isAfter(fromDate, 'day')) {
                const fromFormat = fromDate.format('YYYY-MM-DD');
                const toFormat = toDate.format('YYYY-MM-DD');

                // get last 7 days articles

                const promise = feedAxios.get(path + `&from=${fromFormat}&to=${toFormat}`).then((feedRes: any) => {
                    const articles = feedRes.articles.reduce((arr: any, article: any) => {
                        const titleWordCount = article.title.split(' ').length
                        const titleDescCount = article.description.split(' ').length
                        arr.push({ ...article, titleWordCount, titleDescCount })
                        return arr
                    }, [])

                    db.insert('articles', articles)
                })

                promises.push(promise)
                fromDate.add(1, 'days')
            }

            await Promise.all(promises)

            res.end()
        } catch (e) {
            console.error(e)
        }
    }

    return { getCounter, getSources, add }
}
