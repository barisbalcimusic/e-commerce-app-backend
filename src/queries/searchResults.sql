SELECT products.*,
    JSON_ARRAYAGG(JSON_OBJECT('url', images.url, 'alt', images.alt)) AS images,
    JSON_ARRAYAGG(JSON_OBJECT('size', sizes.size, 'isAvailable', sizes.isAvailable)) AS sizes
FROM products 
    LEFT JOIN images ON products.id = images.product_id
    LEFT JOIN sizes ON products.id = sizes.product_id
WHERE name LIKE ?
    OR description LIKE ?
    OR category LIKE ?
    OR targetGroup LIKE ?
    OR brand LIKE ?
GROUP BY 
    products.id, 
    products.name, 
    products.description, 
    products.category, 
    products.targetGroup, 
    products.brand, 
    products.price, 
    products.rating, 
    products.discountPercentage, 
    products.stock, 
    products.soldCount