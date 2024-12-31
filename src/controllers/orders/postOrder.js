import { pool } from "../../utils/config/DBconfig.js";
import {
  mailOptionsFunc,
  transporterFunc,
} from "../../utils/config/mailConfig.js";
import {
  confirmationMailHTML,
  confirmationMailSubject,
} from "../../utils/mailData.js.js";
import { sendMailFunc } from "../../utils/sendMailFunc.js";

export const postOrder = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { address, paymentMethod, cartItems, total } = req.body;

    //! VALIDATE & SANITIZE INPUTS LATER

    if (!userId || !address || !paymentMethod || !cartItems || !total) {
      return res.status(400).json({ message: "missingOrderInfo" });
    }

    // SAVE ORDER INTO ORDERS TABLE
    const [orderResult] = await pool.query(
      "INSERT INTO orders (user_id, total) VALUES (?, ?)",
      [userId, total]
    );

    if (orderResult.affectedRows === 0) {
      return res.status(400).json({ message: "orderNotCreated" });
    }

    // SAVE ORDERED PRODUCTS INTO ORDER_ITEMS TABLE
    const orderId = orderResult.insertId;
    for (const cartItem of cartItems) {
      const [orderItemResult] = await pool.query(
        "INSERT INTO order_items (order_id, product_id, size, quantity, price) VALUES (?, ?, ?, ?, ?)",
        [
          orderId,
          cartItem.product.id,
          cartItem.size,
          cartItem.quantity,
          cartItem.product.price,
        ]
      );

      if (orderItemResult.affectedRows === 0) {
        return res.status(400).json({ message: "orderItemsNotCreated" });
      }
    }

    // SAVE ADDRESS INTO ADDRESSES TABLE
    const [addressResult] = await pool.query(
      "INSERT INTO addresses (user_id, title, firstname, lastname, street, house_number, postal_code, city, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        userId,
        address.title,
        address.firstName,
        address.lastName,
        address.street,
        address.houseNumber,
        address.postalCode,
        address.city,
        address.country,
      ]
    );

    if (addressResult.affectedRows === 0) {
      return res.status(400).json({ message: "addressNotCreated" });
    }

    // GET USER EMAIL
    const [[{ email }]] = await pool.query(
      "SELECT email FROM users WHERE id = ?",
      [userId]
    );

    //SEND CONFIRMATION EMAIL
    const transporter = transporterFunc();
    const mailOptions = mailOptionsFunc(
      email,
      confirmationMailSubject,
      confirmationMailHTML(cartItems, paymentMethod, address, total)
    );
    const confirmationMailSent = await sendMailFunc(transporter, mailOptions);

    if (!confirmationMailSent) {
      //! SHOULD I DELETE THE ORDER AND ORDER ITEMS NOW?
      return res.status(500).json({ message: "confirmationMailNotSent" });
    }

    next();
  } catch (error) {
    next(error);
  }
};
