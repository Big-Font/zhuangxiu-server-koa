module.exports = {
    /*
    *   用户添加购物车
    */
    addShopcar: `
        INSERT INTO
            c_sp_goods_shopcar
            (
                userid,
                good_id,
                num,
                del_flag,
                create_time,
                update_time
            )
        VALUES
            (?,?,?,0,NOW(),NOW())
    `,
    /*
    *   查询购物车中是否已添加过当前商品
    */
    queryShopcarHasGood: `
        SELECT
            id,
            good_id,
            num
        FROM
            c_sp_goods_shopcar
        WHERE
            userid=? AND good_id=? AND del_flag=0
    `,
    /*
    *   购物车商品数量修改
    */
    changeShopcarNum: `
        UPDATE
            c_sp_goods_shopcar
        SET
            num=?
        WHERE
            id=?
    `,
    /*
    *
    */
    queryShopcarList: `
        SELECT
            c.id,
            c.good_id,
            c.num,
            g.goods_name AS name,
            g.goods_price AS price,
            g.goods_img AS img,
            s.name AS seller
        FROM
            c_sp_goods_shopcar AS c
        JOIN
            c_sp_goodslist AS g
        ON
            c.good_id=g.id
        JOIN
            c_sp_sellers AS s
        ON
            g.seller_id=s.id
        WHERE
            c.userid=? AND c.del_flag=0   
    `,
    /*
    *   修改购物车信息（修改数量、删除商品）
    */
    modeifyShopcar: `
        UPDATE 
            c_sp_goods_shopcar  
        SET
            ??=?
        WHERE
            userid=? AND id=?
    `
}