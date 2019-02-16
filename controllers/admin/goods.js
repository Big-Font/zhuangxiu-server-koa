import uuid from 'uuid';
import { query, queryCount, sqlPage, execTrans, _getNewSqlParamEntity } from '../../sql';
import MGoodsSQL from '../../sql/admin/goods';

class GoodsControllers {
    /*
    *   商品列表中品牌、商家、类别查询接口--用于商品信息修改和发布
    */
    async goodsInfoUpdateList(ctx) {
        let sellerList, brandList, typeList;
        // 查询商家
        try {
            sellerList = await query(MGoodsSQL.getSellersList.split('LIMIT')[0])
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
        // 查询品牌
        try {
            brandList = await query(MGoodsSQL.getBrandList.split('LIMIT')[0])
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
        // 查询分类
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
            typeList = dealData(list);
        }catch(err) {
            ctx.error({msg: err.message})
            return;
        }

        ctx.success({
            sellerList, 
            brandList, 
            typeList,
            code: '查询成功'
        })
    }
    /*
    *   商品列表
    *   @params 模糊搜索： name--商品名称  seller--商家  brand--品牌  
    *           精确搜索： typeId--类型id
    *           page--分页
    */
    async getGoods(ctx) {
        let { name, seller, brand, typeId, page } = ctx.request.body; 
        // 分页
        let queryValues = [], values = [],pageValues = [], sql, page_num, total_page, results;

        if(!page) {
            page = 1;
        }
        if(!!name) {
            values.push('l.goods_name');
            values.push(`%${name}%`);
        }
        if(!!seller) {
            values.push('s.name');
            values.push(`%${seller}%`);
            console.log(values)
        }
        if(!!brand) {
            values.push('c.name');
            values.push(`%${brand}%`);
            console.log(values)
        }
        if(!!typeId) {
            values.push('g.id');
            values.push(typeId);
        }

        if(values.length === 8) {
            sql = MGoodsSQL.queryGoodsListFour;
        }else if(values.length === 6) {
            sql = MGoodsSQL.queryGoodsListThree;
        }else if(values.length === 4) {
            sql = MGoodsSQL.queryGoodsListTwo;
        }else if(values.length === 2) {
            sql = MGoodsSQL.queryGoodsListOne;
        }else {
            sql = MGoodsSQL.queryGoodsList;
        }

        try{
            let res = await sqlPage(page, sql, values);
            pageValues = res.pageValues;
            page_num = res.page_num;
            total_page = res.total_page;
        }catch(err) {
            ctx.error({msg: err.message}); 
            return;
        }
        // const artUUID = uuid.v1();
        // console.log(artUUID.replace(/\-/g, ''))
        // start end 
        queryValues = values.concat(pageValues);

        try {
            results = await query(sql, queryValues)
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
    *   @params name:商品品牌  seller:商家名称 page页码
    */
    async getBrandList(ctx) {
        let { name, seller, page } = ctx.request.body;
        // 分页
        let queryValues = [], values = [],pageValues = [], sql, page_num, total_page, results;

        if(!page) {
            page = 1;
        }
        if(!!name) {
            values.push('a.name');
            values.push(`%${name}%`);
        }
        if(!!seller) {
            values.push('b.name');
            values.push(`%${seller}%`);
        }

        if(values.length === 4) {
            sql = MGoodsSQL.getBrandListTwo;
        }else if(values.length === 2) {
            sql = MGoodsSQL.getBrandListOne;
        }else {
            sql = MGoodsSQL.getBrandList
        }

        try{
            let res = await sqlPage(page, sql, values);
            pageValues = res.pageValues;
            page_num = res.page_num;
            total_page = res.total_page;
            page = res.page;
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }

        // start end 
        queryValues = values.concat(pageValues);

        try {
            results = await query(sql, queryValues)
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
    *   查询所有商家（不分页）
    */
    async getSellersListNoPage(ctx) {
        try{
            let res = await query(MGoodsSQL.getSellersListNoPage);
            ctx.success({
                list: res,
                msg: '查询成功'
            });
        }catch(err) {
            ctx.error({msg: err.message});
        }
    }
    /*
    *   发布品牌信息
    *   @params   name:品牌名称  sellerId:商家id 
    */
    async publicBrandInfo(ctx) {
        let { name, sellerId } = ctx.request.body;
        if(!name) {
            ctx.error({msg: '品牌名称不能为空'});
            return;
        }
        if(!sellerId) {
            ctx.error({msg: '品牌所属商家不能为空'});
            return;
        }

        try{
            let res = await query(MGoodsSQL.publicBrandInfo, [name, sellerId]);
            ctx.success({msg: '品牌添加成功'});
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
    }
    /*
    *   修改品牌信息
    *   @params  id:品牌id  name:品牌名称  sellerId:商家id  del_flag:品牌状态（0正常）
    */
    async modeifyBrandInfo(ctx) {
        let { id, name, sellerId, del_flag } = ctx.request.body;
        if(!id) {
            ctx.error({msg: '品牌id不能为空'});
            return;
        }
        if(!name) {
            ctx.error({msg: '品牌名称不能为空'});
            return;
        }
        if(!sellerId) {
            ctx.error({msg: '品牌所属商家不能为空'});
            return;
        }
        if(!del_flag) {
            ctx.error({msg: '品牌状态不能为空'});
            return;
        }

        try{
            let res = await query(MGoodsSQL.modeifyBrandInfo, [name, sellerId, del_flag, id]);
            ctx.success({msg: '入库成功'});
        }catch(err) {
            ctx.error({msg: err.message});
        }
    }
    /*
    *   商家查询搜索
    *   @params 模糊搜索  name:商家名称   address：商家地址   tel：商家电话
    *                    page：页码
    */
    async getSellersList(ctx) {
        let { name, address, tel, page } = ctx.request.body;
        // 分页
        let queryValues = [], values = [],pageValues = [], sql, page_num, total_page, results;

        if(!page) {
            page = 1;
        }
        if(!!name) {
            values.push('name');
            values.push(`%${name}%`);
        }
        if(!!address) {
            values.push('address');
            values.push(`%${address}%`);
        }
        if(!!tel) {
            values.push('tel');
            values.push(`%${tel}%`);
        }

        if(values.length === 6) {
            sql = MGoodsSQL.getSellersListThree;
        }else if(values.length === 4) {
            sql = MGoodsSQL.getSellersListTwo;
        }else if(values.length === 2) {
            sql = MGoodsSQL.getSellersListOne;
        }else {
            sql = MGoodsSQL.getSellersList;
        }

        try{
            let res = await sqlPage(page, sql, values);
            pageValues = res.pageValues;
            page_num = res.page_num;
            total_page = res.total_page;
            page = res.page;
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }

        // start end 
        queryValues = values.concat(pageValues);

        try {
            results = await query(sql, queryValues)
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
    *   添加商家
    *   @params name:商家名称  address：商家地址  tel：商家联系电话  img: 商家门店照片
    */
    async publicSellerInfo(ctx) {
        let {name, address, tel, img} = ctx.request.body;
        if(!name) {
            ctx.error({msg: '商家名称不能为空'});
            return;
        }
        if(!address) {
            ctx.error({msg: '商家地址不能为空'});
            return;
        }
        if(!tel) {
            ctx.error({msg: '商家联系电话不能为空'});
            return;
        }
        if(!img) {
            ctx.error({msg: '商家店面照片不能为空'});
            return;
        }

        try{
            let res = await query(MGoodsSQL.publicSellerInfo, [name, address, tel, img]);
            ctx.success({msg: '入库成功'});
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
    }
    /*
    *   商家信息修改
    *   @params id:商家表id  name:商家名称  address:商家地址  tel:商家联系电话  del_flag:删除标记  img:商家店面照片
    */
    async modeifySellerInfo(ctx) {
        let {id, name, address, tel, del_flag, img} = ctx.request.body;
        if(!id) {
            ctx.error({msg: '商家id不能为空'});
            return;
        }
        if(!name) {
            ctx.error({msg: '商家名称不能为空'});
            return;
        }
        if(!address) {
            ctx.error({msg: '商家地址不能为空'});
            return;
        }
        if(!tel) {
            ctx.error({msg: '商家联系电话不能为空'});
            return;
        }
        if(del_flag !== '0' && !del_flag) {
            ctx.error({msg: '删除标记不能为空'});
            return;
        }

        try{
            let res = await query(MGoodsSQL.modeifySellerInfo, [name, address, tel, del_flag, img, id,]);
            ctx.success({msg: '入库成功'});
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
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