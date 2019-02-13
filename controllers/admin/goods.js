import uuid from 'uuid';
import { query, queryCount, sqlPage, execTrans, _getNewSqlParamEntity } from '../../sql';
import MGoodsSQL from '../../sql/admin/goods';

class GoodsControllers {
    /*
    *   商品列表
    *   @params genre--商品分类id  brand--品牌id  page--分页
    */
    async getGoods(ctx) {
        let { genre, brand, page } = ctx.request.body; 
        // 分页
        let queryValues = [],pageValues = [], page_num, total_page, results;
        try{
            let res = await sqlPage(page, MGoodsSQL.queryGoodsList, []);
            pageValues = res.pageValues;
            page_num = res.page_num;
            total_page = res.total_page;
        }catch(err) {
            ctx.error({msg: err.message}); 
            return;
        }
        const artUUID = uuid.v1();
        console.log(artUUID.replace(/\-/g, ''))

        try {
            results = await query(MGoodsSQL.queryGoodsList, pageValues)
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
        ctx.success({
            list: results,
            total_page,
            page,
            msg: '查询成功'
        })
    }
    /*
    *   商品品牌查询搜索
    */
    async getBrandList(ctx) {
        let { brand } = ctx.request.body;
        let results;
        try {
            results = await query(MGoodsSQL.getBrandList)
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
        ctx.success({
            list: results,
            msg: '查询成功'
        })
    }
    /*
    *   商家名称查询搜索
    */
    async getSellersList(ctx) {
        let { sellerId } = ctx.request.body;
        let results;
        try {
            results = await query(MGoodsSQL.getSellersList)
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
        ctx.success({
            list: results,
            msg: '查询成功'
        })
    }
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
                        if(i!==j && d[i].pid === d[j].value){
                            if(!d[j].children) d[j].children = [];
                            d[j].children.push(d[i]);
                            continue;
                        }
                    }
                }
                let result = [];
                for(let k=0;k<l;k++) if(d[k].pid===0) result.push(d[k]);
                return result;
            }

            // function dealData(data){
            //     let d = data, l = d.length;
            //     for(let i=0;i<l;i++){
            //         for(let j=0;j<l;j++){
            //             if(i!==j && d[i].pid === d[j].id){
            //                 if(!d[j].children) d[j].children = [];
            //                 d[j].children.push(d[i]);
            //                 continue;
            //             }
            //         }
            //     }
            //     let result = [];
            //     for(let k=0;k<l;k++) if(d[k].pid===0) result.push(d[k]);
            //     return result;
            // }

            // function arrList(arr) {
            //     arr.map((item,index)=> {
            //         arr.map((k,y)=>{
            //             if(item.id==k.pid) {
            //                 if(!item.child)item.child = [];
            //                 item.child.push(k);
            //             }
            //         })
            //     })
            //     return arr
            // }
            // let newAll = arrList(list)
            // let arrlist = []
            // newAll.map((item)=>{
            //     if(item.pid == 0) {
            //         arrlist.push(item)
            //     }
            // })
           

            // list = list.sort((a , b) => {
            //     return a.pid - b.pid;
            //    })
            //    let result = [];
            //    list.forEach((item , index) => {
            //     if(item.pid == 0){
            //      result.push(item);
            //     }
            //    })
            //    list = list.filter((item) => {
            //     return item.pid !== 0;
            //    })
            //    console.log(list)
            //    function oneByOneFn(listArr , index , resultArr){
            //     if(!listArr[index]) return;
            //     let pid = listArr[index].pid;
            //     let obj = listArr[index];
            //     resultArr.forEach((item , len) => {
            //      if(item.id == pid){
            //       repeatFn(item , obj);
            //      }else{
            //       if(!item.child){
            //        item.child = [];
            //       }else{
            //        checkChildFn(item.child , pid , obj);
            //       }
            //      }
            //     })
            //     result = resultArr;
            //     let ins = index + 1;
            //     oneByOneFn(listArr , ins , resultArr);
            //    }
            //    function checkChildFn(childArr , pid , obj){
            //     if(!childArr.length) return;
            //     childArr.forEach((item , len) => {
            //         if(item.id == pid){
            //          repeatFn(item , obj)
            //         }else{
            //          if(!item.child){
            //         //   item.child = [];
            //          }else{
            //           checkChildFn(item.child , pid , obj);
            //          }
            //         }
            //        })
            //       }
            //       function repeatFn(item , obj) {
            //        if(!item.child){
            //         item.child = [];
            //        }
            //        item.child.push(obj);
            //        item.child = item.child.sort((a , b) => {
            //         return a.id - b.id;
            //        })
            //       }
            //       oneByOneFn(list , 0 , result);
                  
               
            

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
                // list: result
            })
        }catch(err) {
            ctx.error({msg: err.message})
        }
    }
}

module.exports = new GoodsControllers();