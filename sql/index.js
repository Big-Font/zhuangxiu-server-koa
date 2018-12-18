import mysql from 'mysql';
import async from 'async';
import config from '../config';

const connection = mysql.createConnection(config[process.env.NODE_ENV].mysql)
const pool = mysql.createPool(config[process.env.NODE_ENV].mysql);

/*
*   增删改查 sql 语句封装 
*   @args
*   sql    sql语句
*   values
*/
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

/*
*   事务操作的封装 
*   @args
*   sqlparamsEntities    sql队列 type: array
*   callback
*/
export let execTrans = function(sqlparamsEntities) {
    return new Promise( (resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            }
            connection.beginTransaction(function (err) {
                if (err) {
                    reject(err)
                }
                console.log("开始执行transaction，共执行" + sqlparamsEntities.length + "条sql");
                var funcAry = [];
                sqlparamsEntities.forEach(function (sql_param) {
                    var temp = function (cb) {
                        var sql = sql_param.sql;
                        var param = sql_param.params;
                        connection.query(sql, param, function (tErr, rows, fields) {
                            if (tErr) {
                                connection.rollback(function () {
                                    console.log("事务失败，" + sql_param + "，ERROR：" + tErr);
                                    throw tErr;
                                });
                            } else {
                                return cb(null, 'ok');
                            }
                        })
                    };
                    funcAry.push(temp);
                });
    
                async.series(funcAry, function (err, result) {
                    if (err) {
                        connection.rollback(function (err) {
                            console.log("transaction error: " + err);
                            connection.release();
                            reject(err)
                        });
                    } else {
                        connection.commit(function (err, info) {
                            if (err) {
                                console.log("执行事务失败，" + err);
                                connection.rollback(function (err) {
                                    console.log("transaction error: " + err);
                                    connection.release();
                                    reject(err)
                                });
                            } else {
                                connection.release();
                                // return callback(null, info);
                                resolve(info)
                            }
                        })
                    }
                })
            });
        });
    }) 
}