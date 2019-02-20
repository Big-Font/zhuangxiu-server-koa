module.exports = {
    categoryList: `
        SELECT
            s.id AS value,
            s.pid,
            s.label,
            s.tree,
            p.label as type
        FROM
            c_sp_genre as s
        LEFT JOIN
            c_sp_genre as p
        ON
            s.pid=p.id
        WHERE
            s.del_flag=0
    `,
    /*
    *   添加商品分类
    */
    publicCategory: `
        INSERT INTO
            c_sp_genre 
            (
                pid,
                label,
                tree,
                del_flag,
                create_time,
                update_time
            )
        VALUES
            (?,?,?,0,NOW(),NOW())
    `,
    /*
    *   商品分类的删除
    */
    deleteCategory: `
        UPDATE 
            c_sp_genre
        SET
            del_flag=1
        WHERE
            id=?
    `,
    /*
    *   商品分类名称的修改
    */  
    modeifyCategory: `
        UPDATE 
            c_sp_genre
        SET
            label=?
        WHERE
            id=?
    `,
    /*
    *   品牌管理--后台管理
    */
    getBrandList: `
        SELECT 
            a.id,
            b.id AS sellerId,
            a.name,
            b.name AS seller,
            a.del_flag
        FROM
            c_sp_goods_brand AS a
        LEFT JOIN
            c_sp_sellers AS b
        ON 
            a.seller_id=b.id
        WHERE
            a.del_flag=0
        ORDER BY
            a.update_time
        DESC
        LIMIT 
            ? OFFSET ?
    `,
    /*
    *   品牌管理模糊查询一个参数
    */
    getBrandListOne: `
        SELECT 
            a.id,
            b.id AS sellerId,
            a.name,
            b.name AS seller,
            a.del_flag
        FROM
            c_sp_goods_brand AS a
        LEFT JOIN
            c_sp_sellers AS b
        ON 
            a.seller_id=b.id
        WHERE
            a.del_flag=0 AND ?? like ?
        ORDER BY
            a.update_time
        DESC
        LIMIT 
            ? OFFSET ?
    `,
    /*
    *   品牌管理模糊查询两个参数
    */
    getBrandListTwo: `
        SELECT 
            a.id,
            b.id AS sellerId,
            a.name,
            b.name AS seller,
            a.del_flag
        FROM
            c_sp_goods_brand AS a
        LEFT JOIN
            c_sp_sellers AS b
        ON 
            a.seller_id=b.id
        WHERE
            a.del_flag=0 AND ?? like ? AND ?? like ?
        ORDER BY
            a.update_time
        DESC
        LIMIT 
            ? OFFSET ?
    `,
    /*
    *   品牌管理模糊查询三个参数
    */
    getSellersListOne: `
        SELECT 
            a.id,
            b.id AS sellerId,
            a.name,
            b.name AS seller,
            a.del_flag
        FROM
            c_sp_goods_brand AS a
        LEFT JOIN
            c_sp_sellers AS b
        ON 
            a.seller_id=b.id
        WHERE
            a.del_flag=0 AND ?? like ? AND ?? like ? AND ?? like ?
        ORDER BY
            a.update_time
        DESC
        LIMIT 
            ? OFFSET ?
    `,
    /*
    *   发布品牌信息
    */
    publicBrandInfo: `
        INSERT INTO
            c_sp_goods_brand
            (
                name, 
                seller_id,
                del_flag,
                create_time,
                update_time
            )
        VALUES
            (?,?,0,NOW(),NOW())
    `,
    /*
    *   修改品牌信息
    */
    modeifyBrandInfo: `
        UPDATE
            c_sp_goods_brand
        SET
            name=?,
            seller_id=?,
            del_flag=?,
            update_time=NOW()
        WHERE
            id=?
    `,
    /*
    *   商家管理--后台管理
    */
    getSellersList: `
        SELECT 
            *
        FROM
            c_sp_sellers
        WHERE
            del_flag=0
        ORDER BY
            update_time
        DESC
        LIMIT 
            ? OFFSET ?
    `,
    /*
    *   商家管理模糊查询一个参数
    */
   getSellersListOne: `
        SELECT 
            *
        FROM
            c_sp_sellers
        WHERE
            del_flag=0 AND ?? like ?
        ORDER BY
            update_time
        DESC
        LIMIT 
            ? OFFSET ?
    `,
    /*
    *   商家管理模糊查询两个参数
    */
    getSellersListTwo: `
        SELECT 
            *
        FROM
            c_sp_sellers
        WHERE
            del_flag=0 AND ?? like ? AND ?? like ?
        ORDER BY
            update_time
        DESC
        LIMIT 
            ? OFFSET ?
    `,
    /*
    *   商家管理模糊查询两个参数
    */
   getSellersListThree: `
        SELECT 
            *
        FROM
            c_sp_sellers
        WHERE
            del_flag=0 AND ?? like ? AND ?? like ? AND ?? like ?
        ORDER BY
            update_time
        DESC
        LIMIT 
            ? OFFSET ?
    `,
    /*
    *   后台管理商品列表查询全部查询
    */
    queryGoodsList: `
        SELECT
            l.id,
            c.id AS brandId,
            genre_id AS genreId,
            tree,
            goods_name AS name,
            c.name AS brand,
            goods_price AS price,
            tag,
            introduce,
            goods_img AS img,
            s.name AS seller,
            s.id AS sellerId,
            g.label AS type,
            e.detail
        FROM
            c_sp_goodslist AS l
        LEFT JOIN
            c_sp_genre AS g
        ON
            l.genre_id=g.id
        LEFT JOIN
            c_sp_goods_brand AS c
        ON
            l.goods_brand_id=c.id
        LEFT JOIN
            c_sp_sellers AS s
        ON
            l.seller_id=s.id
        LEFT JOIN
            c_sp_goodsdetail AS e
        ON
            l.goods_uuid=e.goods_uuid
        ORDER BY 
            l.update_time 
        DESC
        LIMIT 
            ? OFFSET ? 
    `,
    /*
    *   后台管理商品列表查询一个筛选条件查询
    */
    queryGoodsListOne: `
        SELECT
            l.id,
            c.id AS brandId,
            genre_id AS genreId,
            tree,
            goods_name AS name,
            c.name AS brand,
            goods_price AS price,
            tag,
            introduce,
            goods_img AS img,
            s.name AS seller,
            s.id AS sellerId,
            g.label AS type,
            e.detail
        FROM
            c_sp_goodslist AS l
        LEFT JOIN
            c_sp_genre AS g
        ON
            l.genre_id=g.id
        LEFT JOIN
            c_sp_goods_brand AS c
        ON
            l.goods_brand_id=c.id
        LEFT JOIN
            c_sp_sellers AS s
        ON
            l.seller_id=s.id
        LEFT JOIN
            c_sp_goodsdetail AS e
        ON
            l.goods_uuid=e.goods_uuid
        WHERE
            ?? like ?
        ORDER BY 
            l.update_time 
        DESC
        LIMIT 
            ? OFFSET ? 
    `,
    /*
    *   后台管理商品列表查询一个筛选条件查询
    */
   queryGoodsListTwo: `
        SELECT
            l.id,
            c.id AS brandId,
            genre_id AS genreId,
            tree,
            goods_name AS name,
            c.name AS brand,
            goods_price AS price,
            tag,
            introduce,
            goods_img AS img,
            s.name AS seller,
            s.id AS sellerId,
            g.label AS type,
            e.detail
        FROM
            c_sp_goodslist AS l
        LEFT JOIN
            c_sp_genre AS g
        ON
            l.genre_id=g.id
        LEFT JOIN
            c_sp_goods_brand AS c
        ON
            l.goods_brand_id=c.id
        LEFT JOIN
            c_sp_sellers AS s
        ON
            l.seller_id=s.id
        LEFT JOIN
            c_sp_goodsdetail AS e
        ON
            l.goods_uuid=e.goods_uuid
        WHERE
            ?? like ? AND ?? like ?
        ORDER BY 
            l.update_time 
        DESC
        LIMIT 
            ? OFFSET ? 
    `,
    queryGoodsListThree: `
        SELECT
            l.id,
            c.id AS brandId,
            genre_id AS genreId,
            tree,
            goods_name AS name,
            c.name AS brand,
            goods_price AS price,
            tag,
            introduce,
            goods_img AS img,
            s.name AS seller,
            s.id AS sellerId,
            g.label AS type,
            e.detail
        FROM
            c_sp_goodslist AS l
        LEFT JOIN
            c_sp_genre AS g
        ON
            l.genre_id=g.id
        LEFT JOIN
            c_sp_goods_brand AS c
        ON
            l.goods_brand_id=c.id
        LEFT JOIN
            c_sp_sellers AS s
        ON
            l.seller_id=s.id
        LEFT JOIN
            c_sp_goodsdetail AS e
        ON
            l.goods_uuid=e.goods_uuid
        WHERE
            ?? like ? AND ?? like ? AND ?? like ?
        ORDER BY 
            l.update_time 
        DESC
        LIMIT 
            ? OFFSET ? 
    `,
    queryGoodsListFour: `
        SELECT
            l.id,
            c.id AS brandId,
            genre_id AS genreId,
            tree,
            goods_name AS name,
            c.name AS brand,
            goods_price AS price,
            tag,
            introduce,
            goods_img AS img,
            s.name AS seller,
            s.id AS sellerId,
            g.label AS type,
            e.detail
        FROM
            c_sp_goodslist AS l
        LEFT JOIN
            c_sp_genre AS g
        ON
            l.genre_id=g.id
        LEFT JOIN
            c_sp_goods_brand AS c
        ON
            l.goods_brand_id=c.id
        LEFT JOIN
            c_sp_sellers AS s
        ON
            l.seller_id=s.id
        LEFT JOIN
            c_sp_goodsdetail AS e
        ON
            l.goods_uuid=e.goods_uuid
        WHERE
            ?? like ? AND ?? like ? AND ?? like ? AND ?? like ?
        ORDER BY 
            l.update_time 
        DESC
        LIMIT 
            ? OFFSET ? 
    `,
    /*
    *   修改商家信息
    */
    modeifySellerInfo: `
        UPDATE
            c_sp_sellers
        SET
            name=?,
            address=?,
            tel=?,
            del_flag=?,
            img=?,
            update_time=NOW()
        WHERE
            id=?
    `,
    /*
    *   添加商家
    */
    publicSellerInfo: `
        INSERT INTO
            c_sp_sellers
            (
                name,
                address,
                tel,
                img,
                del_flag,
                create_time,
                update_time
            )
        VALUES
            (?,?,?,?,0,NOW(),NOW())
    `,
    /*
    *   查询所有商家（不分页）
    */
    getSellersListNoPage: `
        SELECT 
            *
        FROM
            c_sp_sellers
        WHERE
            del_flag=0
        ORDER BY
            update_time
        DESC
    `
}