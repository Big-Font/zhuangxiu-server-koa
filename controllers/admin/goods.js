import uuid from 'uuid';
import { query, queryCount, sqlPage, execTrans, _getNewSqlParamEntity } from '../../sql';
import MGoodsSQL from '../../sql/admin/goods';

class GoodsControllers {
    /*
    *   商品列表分类查询
    */
    async categoryList(ctx) {
        try{
            let list = await query(MGoodsSQL.categoryList);

            function dealData(data){
                let d = data, l = d.length;
                for(let i=0;i<l;i++){
                    for(let j=0;j<l;j++){
                        if(i!==j && d[i].pid === d[j].id){
                            if(!d[j].child) d[j].child = [];
                            d[j].child.push(d[i]);
                            continue;
                        }
                    }
                }
                let result = [];
                for(let k=0;k<l;k++) if(d[k].pid===0) result.push(d[k]);
                return result;
            }
            

            // let result = [];
            // list.map((item)=>{
            //     item.children = findAllChild(list, item.id)
            //     if(item.pid === 0) {
            //         result.push(item)
            //     }
            // })
            // function findAllChild(list, pid) {
            //     let result = [];
            //     list.map((item)=>{
            //         if(item.pid === pid){
            //             result.push(item);
            //         }
            //     })
            //     return result;
            // }

            ctx.success({
                msg: '查询成功', 
                result: dealData(list)
            })
        }catch(err) {
            ctx.error({msg: err.message})
        }
    }
}

module.exports = new GoodsControllers();