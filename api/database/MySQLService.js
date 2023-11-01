import connection from './mysql'

export class MySQLService {
    static async query(query, placeholders = []) {
        return new Promise((res, rej) => {
            connection.query(query, placeholders, (err, results, fields) => {
                if (err) {
                    rej(err)
                } else {
                    res(results)
                }
            })
        })
    }
}
