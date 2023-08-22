const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');
const Service = require('../models/Service');

const cartController = {
  addToCart: async (req, res) => {
    try {
      const { userId, productId, serviceId, quantity } = req.body;

      // Fetch the user, product, and service
      const user = await User.findById(userId);
      const product = await Product.findById(productId);
      const service = await Service.findById(serviceId);

      // Check if user, product, and service exist
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      if (!product) {
        return res.status(404).json({ error: 'Product not found.' });
      }
      if (!service) {
        return res.status(404).json({ error: 'Service not found.' });
      }

      const item = product || service;
      const itemPrice = item.price;
      let itemTax = 0;

      // Calculate tax
      switch (item.taxCategory) {
        case 'PA':
          if (itemPrice > 1000 && itemPrice <= 5000) {
            itemTax = (itemPrice * 12) / 100;
          } else if (itemPrice > 5000) {
            itemTax = (itemPrice * 18) / 100;
          }
          break;
        case 'PB':
          if (itemPrice > 5000) {
            itemTax = (itemPrice * 18) / 100;
          }
          break;
        case 'PC':
          itemTax = 200;
          break;
        case 'SA':
          if (itemPrice > 1000 && itemPrice <= 8000) {
            itemTax = (itemPrice * 10) / 100;
          } else if (itemPrice > 8000) {
            itemTax = (itemPrice * 15) / 100;
          }
          break;
        case 'SB':
          if (itemPrice > 8000) {
            itemTax = (itemPrice * 15) / 100;
          }
          break;
        case 'SC':
          itemTax = 100;
          break;
        default:
          itemTax = 0;
          break;
      }

      // Update the user's cart
      const userCart = await Cart.findOne({ userId });

      if (!userCart) {
        const newCart = await Cart.create({ userId, items: [] });
        userCart = newCart;
      }

      const existingItemIndex = userCart.items.findIndex(item => {
        return (
          (productId && item.product && item.product.equals(productId)) ||
          (serviceId && item.service && item.service.equals(serviceId))
        );
      });

      if (existingItemIndex !== -1) {
        // If the item already exists, update the quantity
        userCart.items[existingItemIndex].quantity += quantity;
      } else {
        // If the item doesn't exist, add it to the cart
        const newItem = {
          product: productId,
          service: serviceId,
          quantity: quantity,
          tax: itemTax,
          total: itemPrice * quantity + itemTax,
        };
        userCart.items.push(newItem);
      }

      // Save the cart
      await userCart.save();

      res.status(200).json({ message: 'Item added to cart successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add item to cart.' });
    }
  },
  
  clearCart: async (req, res) => {
    try {
      const { userId } = req.body;
      await Cart.findOneAndDelete({ userId });
      res.status(200).json({ message: 'Cart cleared successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to clear cart.' });
    }
  },

  removeFromCart: async (req, res) => {
    try {
      const { userId, itemId } = req.body;

      const userCart = await Cart.findOne({ userId });

      if (!userCart) {
        return res.status(404).json({ error: 'Cart not found.' });
      }

      // Find the index of the item to remove
      const itemIndex = userCart.items.findIndex(item => item._id.toString() === itemId);

      if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found in cart.' });
      }

      // Remove the item
      userCart.items.splice(itemIndex, 1);

      // Update the cart
      await userCart.save();

      res.status(200).json({ message: 'Item removed from cart successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove item from cart.' });
    }
  },

  getCartItems: async (req, res) => {
    try {
      const { userId } = req.query;
      const userCart = await Cart.findOne({ userId }).populate('items.product items.service');

      if (!userCart) {
        return res.status(404).json({ error: 'Cart not found.' });
      }

      res.status(200).json(userCart.items);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cart items.' });
    }
  },
};

module.exports = cartController;