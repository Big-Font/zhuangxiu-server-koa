module.exports = {
    categoryList: `
        SELECT
            s.id,
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
            g.label AS type
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
        ORDER BY 
            l.update_time 
        DESC
        LIMIT 
            ? OFFSET ? 
    `,
}