import _ from "lodash";
import { calculateDiscountedPrice } from "./calculateDiscountedPrice.js";

// VERIFICATION MAIL
export const verificationMailSubject = "BuyTheWay email verification";
export const verificationMailHTML = (verificationToken, userId) => {
  return `
    <html>
    <head>
        <style>
            h1 { color: #333; }
            h2 { color: #555; }
            p { font-size: 16px; }
            .container { 
                font-family: Verdana, Arial, sans-serif;
                padding: 20px; 
            }
            .button {
                text-decoration: none;
                font-size: 16px;
                cursor: pointer;
                font-weight: bold;
            }
            .button:link {
                color: blue;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 style="background-color:rgb(230, 156, 72); padding:10px;">Willkommen bei BuyTheWay!</h1>
            <h2>Vielen Dank für Ihre Registrierung</h2>
            <p>Hallo,</p>
            <p>Ihre Registrierung bei BuyTheWay war erfolgreich.</p>
            <p>Bitte klicken Sie auf den untenstehenden Link, um Ihre E-Mail-Adresse zu bestätigen:</p>
            <p><a href="https://proxy.barisbalci.de/api/auth/verifyUser?token=${verificationToken}&userId=${userId}" class="button">E-Mail bestätigen</a></p>
            <p>Wenn Sie Fragen haben, können Sie uns gerne kontaktieren.</p>
            <p>Mit freundlichen Grüßen,<br>Ihr BuyTheWay-Team</p>
        </div>
    </body>
    </html>
    `;
};

// ORDER CONFIRMATION MAIL
export const confirmationMailSubject = "Bestätigung Ihrer Bestellung";
export const confirmationMailHTML = (
  cartItems,
  paymentMethod,
  address,
  total
) => {
  // MAP CART ITEMS
  const mappedCartItems = (cartItems) => {
    return cartItems
      .map((cartItem) => {
        return `
            <div class="order-item">
                <p><span>Produktname: </span>${cartItem.product.name}</p>
                <p><span>Einzelpreis: </span>${
                  cartItem.product.discountPercentage > 0
                    ? calculateDiscountedPrice(
                        cartItem.product.price,
                        cartItem.product.discountPercentage
                      )
                    : cartItem.product.price
                }€</p>
                <p><span>Menge: </span>${cartItem.quantity}</p>
            </div>
        `;
      })
      .join("");
  };

  const addressInfo = `
  ${_.capitalize(address.title)} ${_.capitalize(
    address.firstName
  )} ${_.capitalize(address.lastName)}<br>
  ${_.capitalize(address.street)} ${address.houseNumber}<br>
  ${address.postalCode} ${_.capitalize(address.city)}<br>
  ${address.country.toUpperCase()}
`;

  return `
    <html>
    <head>
        <style>
            body {
                font-family: Verdana, sans-serif;
            }
            h1 { 
                color: #333; 
                background-color: rgb(230, 156, 72); 
                padding: 10px;
                text-align: center;
                font-size: 24px;
            }
            p { 
                font-size: 16px; 
                line-height: 1.5; 
            }
            span {
                font-weight: bold;
            }
            .container { 
                padding: 20px; 
                max-width: 800px;
                margin: 0 auto;
                background-color: #f9f9f9;
            }
            .order-list {
                margin-top: 20px;
            }
            .order-item {
                padding: 15px;
                margin-bottom: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background-color: #fafafa;
            }
            .total {
                margin-top: 20px;
                font-size: 18px;
                font-weight: bold;
                padding: 10px;
                background-color: #f1f1f1;
                text-align: right;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Bestellbestätigung bei BuyTheWay</h1>
  
            <p>Hallo,</p>
            <p>Ihre Bestellung bei BuyTheWay war erfolgreich.</p>

            <h3>Liefer- und Rechnungsadresse:</h3>
            <div class="address">
              <p>${addressInfo}</p>
            </div>
  
            <h3>Zahlungsmethode:</h3>
            <p>${paymentMethod === "invoice" && "Rechnung"}</p>
            
            <h3>Bestellte Produkte:</h3>
            <div class="order-list">
                ${mappedCartItems(cartItems)}
            </div> 
            <div class="total">
                <p><span>Gesamtbetrag: </span>${total}€</p>
            </div>
  
            <p>Ihre Bestellung wird in Kürze bearbeitet. Wir danken Ihnen für Ihre Bestellung und freuen uns, Sie bald wieder begrüßen zu dürfen.</p>
            <p>Mit freundlichen Grüßen,<br>Ihr BuyTheWay-Team</p>
        </div>
    </body>
    </html>
    `;
};
