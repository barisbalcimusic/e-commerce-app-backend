import { pool } from "../../utils/config/DBconfig.js";

export const getProductsFromCart = async (req, res, next) => {
  try {
    const { userId } = req.user;

    // GET PRODUCTS FROM CART
    const query = `
      SELECT 
          products.id AS product_id,             
          products.name, 
          products.price, 
          cart_items.quantity AS cart_item_quantity, 
          cart_items.size AS cart_item_size,          
          products.brand,                          
          JSON_ARRAYAGG(JSON_OBJECT('url', images.url, 'alt', images.alt)) AS images 
      FROM 
          cart_items
      JOIN 
          carts ON cart_items.cart_id = carts.id
      JOIN 
          products ON cart_items.product_id = products.id
      LEFT JOIN 
          images ON products.id = images.product_id
      WHERE 
          carts.user_id = ?
      GROUP BY 
          products.id, 
          products.name, 
          products.price, 
          cart_items.quantity, 
          cart_items.size, 
          products.brand;
    `;

    const [productsFromCart] = await pool.query(query, [userId]);

    // FORMAT DATA
    const formattedCart = productsFromCart.map((item) => ({
      product: {
        id: item.product_id,
        name: item.name,
        price: item.price,
        brand: item.brand,
        images: item.images,
      },
      size: item.cart_item_size,
      quantity: item.cart_item_quantity,
    }));

    res.status(200).json(formattedCart);
  } catch (error) {
    next(error);
  }
};
