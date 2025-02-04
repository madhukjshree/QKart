import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
// export const generateCartItemsFrom = (cartData, productsData) => {
// };

export const generateCartItemsFrom = (cartData, productsData) => {
  // Ensure productsData is available
  if (
    !productsData ||
    !Array.isArray(productsData) ||
    productsData.length === 0
  ) {
    return [];
  }

  // Iterate through cartData and find corresponding product data
  const cartItems = cartData.map((cartItem) => {
    const product = productsData.find(
      (product) => product._id === cartItem.productId
    );

    // If product not found, log an error and skip to the next cart item
    if (!product) {
      console.error(`Product with ID ${cartItem.productId} not found.`);
      return null;
    }

    // Create a new CartItem object with complete data
    const cartItemData = {
      name: product.name,
      qty: cartItem.qty,
      category: product.category,
      cost: product.cost,
      rating: product.rating,
      image: product.image,
      productId: product._id,
    };

    return cartItemData;
  });

  // Filter out null values (products not found) and return the array of CartItems
  return cartItems.filter(Boolean);
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
 export const getTotalCartValue = (items = []) => {
  return items.reduce((total, item) => total + item.cost * item.qty, 0);
};

export const getTotalItems = (items = []) => {
  if (!items.length) return 0;
  const total = items.reduce((total,item) => total + item.qty, 0);
  return total;
}

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */
const ItemQuantity = ({ value, isReadOnly,handleAdd, handleDelete }) => { 
  if (isReadOnly) {
    return <Box>Qty: {value}</Box>
  }
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */

const Cart = ({ products, items = [], handleQuantity,hasCheckoutButton = false, isReadOnly = false }) => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {items.map((item) => (
          <Box
            key={item.productId}
            display="flex"
            alignItems="flex-start"
            padding="1rem"
          >
            <Box className="image-container">
              <img
                src={item.image} 
                alt={item.name}
                width="100%"
                height="100%"
              />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="6rem"
              paddingX="1rem"
            >
              <div>{item.name}</div>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <ItemQuantity
                  value={item.qty}
                  isReadOnly = {isReadOnly}
                  handleAdd={(e) => {
                    handleQuantity(localStorage.getItem("token"),"","",item.productId, item.qty + 1)
                    // enqueueSnackbar(Add ${item.name} to the cart, {
                    //   variant: "success",
                    // });
                  }}
                  handleDelete={(e) =>
                    {
                      handleQuantity(localStorage.getItem("token"),"","",item.productId, item.qty - 1)
                      // enqueueSnackbar(Removed ${item.name} to the cart, {
                      //   variant: "error",
                      // });
                    }

                  }
                />
                <Box padding="0.5rem" fontWeight="700">
                  ${item.cost}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}

        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>

        {hasCheckoutButton && <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={(e) => history.push("/checkout")}
          >
            Checkout
          </Button>
        </Box>}
      </Box>
        {isReadOnly && <Box classname="cart" padding="1rem" >
        <h2>Order Details</h2>
        <Box className="cart-row">
          <p>products</p>
          <p>{getTotalItems(items)}</p>
        </Box>
        <Box className="cart-row">
          <p>Subtotal</p>
          <p>${getTotalCartValue(items)}</p>
        </Box>
        <Box className="cart-row">
          <p>Shipping Charges</p>
          <p>$0</p>
        </Box>
        <Box className="cart-row">
          <p>Total</p>
          <p>${getTotalItems(items)}</p>
        </Box>
      </Box>}
    </>
  );
};

export default Cart;
