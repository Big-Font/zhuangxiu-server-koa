import mysql from 'mysql';
import config from '../config';

const connection = mysql.createConnection(config[process.env.NODE_ENV].mysql)
const pool = mysql.createPool(config[process.env.NODE_ENV].mysql);

export let query = function( sql, values ) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject( err )
            } else {
                connection.query(sql, values, ( err, rows) => {

                if ( err ) {
                    reject( err )
                } else {
                    resolve( JSON.parse(JSON.stringify(rows)) )
                }
                    connection.release()
                })
            }
        })
    })
}