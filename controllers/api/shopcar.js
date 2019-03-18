import uuid from 'uuid';
import { query, queryCount, sqlPage, execTrans, _getNewSqlParamEntity } from '../../sql';
import ShopcarSQL from '../../sql/api/shopcar';

class ShopcarControllers {
    /*
    *   添加购物车接口
    *   @params goodId: 商品id  num：数量
    */
    async addShopcar(ctx) {
        let userid = ctx.user.userid;
        console.log(ctx.user)
        let { goodId, num } = ctx.request.body;
        if(!userid) {
            ctx.error({msg: '用户信息获取错误'});
            return;
        }
        if(!goodId) {
            ctx.error({msg: '产品id不能为空'});
            return;
        }
        if(!num) {
            ctx.error({msg: '数量不能为空'});
            return;
        }
        if( typeof num === 'number' && num%1 != 0) {
            ctx.error({msg: '添加数量必须为整数'});
            return;
        }
        console.log(`userid: ${userid}`)
        // 先查询此用户购物车中是否含有要添加的商品
        try{
            let carList = await query(ShopcarSQL.queryShopcarHasGood, [userid, goodId])
            console.log(`查询该用户下是否有这个产品的结果是: ${carList.length}`)
            if(!carList.length) {
                // 插入商品 没有该产品的情况用户添加产品num为正值
                try{
                    let res = await query(ShopcarSQL.addShopcar, [userid, goodId, num]);
                    ctx.success({msg: '购物车添加成功'});
                    return;
                }catch(err) {
                    ctx.error({msg: err.message});
                    return;
                }
            }else {
                // 修改商品数量  用户添加过这个产品， num为值的变化量
                console.log(`用户添加过这个产品，这个产品当前的数量为 ${carList[0].num} , 用户要添加的数量为 ${num} , 状态改变后的入库数量为 ${Number(carList[0].num) + Number(num)}`)
                try{
                    let newNum = Number(carList[0].num) + Number(num);
                    let id = carList[0].id;
                    if(newNum > 0) {
                        try{
                            let res = await query(ShopcarSQL.changeShopcarNum, [newNum, id]);
                            ctx.success({msg: '购物车添加成功'})
                            return;
                        }catch(e) {
                            ctx.error({msg: e.message});
                            return;
                        }
                    }else {
                        try{
                            let res = await query(ShopcarSQL.deleteShopcarCell, [id]);
                            ctx.success({msg: `购物车数量小于0，已删除成功`});
                            return;
                        }catch(e) {
                            ctx.error({msg: e.message});
                            return;
                        }
                    }
                }catch(err) {
                    ctx.error({msg: err.message});
                    return;
                }
            }
        }catch(error) {
            ctx.error({msg: error.message});
            return;
        }
    }
    /*
    *   查询购物车列表
    *   @params
    */
    async queryShopcarList(ctx) {
        let total_num = 0, total_price = 0, userid = ctx.user.userid;
        
        if(!userid) {
            ctx.error({msg: '用户信息获取错误'});
            return;
        }

        try{
            let list = await query(ShopcarSQL.queryShopcarList, [userid]);
            for(let item of list) {
                total_price += Number(item.price) * Number(item.num);
            }
            ctx.success({
                list,
                total_num: list.length,
                total_price,
                msg: '查询成功'
            })
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
    }
    /*
    *   修改购物车信息（修改数量、删除商品）
    */
    async modeifyShopcar(ctx) {
        let userid = ctx.user.userid, sqlParams=[];
        let { id, num, del } = ctx.request.body;

        if(!userid) {
            ctx.error({msg: '用户信息获取错误'});
            return;
        }

        if(num && del) {
            ctx.error({msg: '购物车商品修改和删除操作不能同时进行'});
            return;
        }

        if(del) {
            sqlParams.push('del_flag');
            sqlParams.push(-1);
        }else {
            sqlParams.push('num');
            sqlParams.push(num);
        }
        
        sqlParams.push(userid, id)
        // 有删除标记的   ['del_flag', -1, userid, id]
        // 没有删除标记   ['num', num, userid, id]
        console.log(sqlParams);
        try{
            let res = await query(ShopcarSQL.modeifyShopcar, sqlParams);
            ctx.success({msg: '修改成功'});
        }catch(err) {
            ctx.error({msg: err.message});
            return;
        }
    }
}

module.exports = new ShopcarControllers();