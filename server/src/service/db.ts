import { Db, MongoClient } from 'mongodb'

const DB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}/?retryWrites=true&w=majority`

export interface DbServiceInterface {
    find(table: string, data: {}): any;
    insert(table: string, data: any[]): any;
    close(): void;
}

export class DbService implements DbServiceInterface {
    private client: any
    private db: any

    constructor() {
        const url = DB_URI;
        this.client = new MongoClient(url);
        this.client.connect()
            .then(() => {
                this.db = this.client.db('cymulate_db');

                this.db.collection('articles').createIndex( { "url": 1 }, { unique: true } )

                console.log('DB Connected')
            })
            .catch(console.error)
    }

    find = async (table: string, data = {}) => {
        try {
            const collection = this.db.collection(table)
            return await collection.find(data).toArray();
        } catch (e) {
            return []
        }
    }

    insert = async (table: string, data: any[]) => {
        try {
            const collection = this.db.collection(table)
            return await collection.insertMany(data);
        } catch (e) {
            // console.log()
        }
    }

    close = () => {
        this.client.close()
    }
}
