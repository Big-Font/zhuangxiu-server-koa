module.exports = {
    categoryList: `
        SELECT
            s.id AS value,
            s.pid,
            s.label,
            p.label as type
        FROM
            c_sp_genre as s
        LEFT JOIN
            c_sp_genre as p
        ON
            s.pid=p.id
    `,
    queryGoodsList: `
        SELECT
            l.id,
            c.id AS brandId,
            genre_id AS genreId,
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
    getBrandList: `
        SELECT 
            id,
            name
        FROM
            c_sp_goods_brand
        WHERE
            del_flag=0
        ORDER BY
            update_time
        DESC
    `,
    getSellersList: `
        SELECT 
            id,
            name AS seller
        FROM
            c_sp_sellers
        WHERE
            del_flag=0
        ORDER BY
            update_time
        DESC
    `
}