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
        console.log('进入sql：', values)
        pool.getConnection(function(err, connection) {
            if (err) {
                console.log('数据库连接错误:'+err)
                reject( err )
            } else {
                console.log('连接数据库成功')
                connection.query(sql, values, ( error, rows) => {
                    if ( error ) {
                        console.log('sql错误信息:'+error)
                        reject( error )
                    } else {
                        console.log('连接成功')
                        resolve( JSON.parse(JSON.stringify(rows)) )
                    }
                    connection.release()
                })
            }
        })
    })
}

/*
*   查询某个表的总条数 做分页的总页数
*   @args
*    table   表名
*/
export let queryCount = async (table) => {
    return new Promise(async(resolve, reject) => {
        try{
            let res = await query(`SELECT COUNT(*) as total_page FROM ??`, [table])
            let total_page = res.length ? res[0].total_page : 0;
            resolve(total_page)
        }catch(err) {
            reject(err)  
        }
    })
}

/*
*   处理分页逻辑
*   @args
*    table   表名
*/
// 使用方法如下
// let queryValues = [], values = [],pageValues = [], page_num, total_page;
// try{
//     let res = await sqlPage(page, 't_sys_spikelist');
//     pageValues = res.pageValues;
//     page_num = res.page_num;
//     total_page = res.total_page;
// }catch(err) {
//     ctx.error({msg: err});
// }
export let sqlPage = async (page, tables) => {
    return new Promise( async (resolve, reject) => {
        let pageValues = [], page_num = 1, total_page;
        try{
            total_page = await queryCount(tables);
            total_page = total_page%page_num == 0 ? total_page/page_num : total_page/page_num + 1;
        }catch(e){
            reject(e);
        }
        if(!parseInt(page) || parseInt(page) < 0) {
            page = 1;
        }else if(parseInt(page) > total_page && total_page !== 0) {
            page = total_page;
        }else {
            page = parseInt(page);
        }
        pageValues.push(page_num, page_num*(page-1))
        resolve({
            pageValues,
            page_num,
            total_page
        })
    })
    
    
}

/*
*   事务操作中sql预处理  返回值将放进数组作为execTrans函数的参数
*   @args
*   sql      sql语句
*   params   参数
*   callback
*/
export let _getNewSqlParamEntity = function(sql, params, callback) {
    if (callback) {
        return callback(null, {
            sql: sql,
            params: params
        });
    }
    console.log({
        sql: sql,
        params: params
    })
    return {
        sql: sql,
        params: params
    };
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
                console.log('进入事务操作了')
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