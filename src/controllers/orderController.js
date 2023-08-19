const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Service = require('../models/Service');

const calculateTax = (price, taxPercentage) => {
  return (price * taxPercentage) / 100;
};

const orderController = {
  confirmOrder: async (req, res) => {
    try {
      const { userId } = req.body;

      // Fetch cart
      const userCart = await Cart.findOne({ userId }).populate('items.product items.service');

      if (!userCart || userCart.items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty.' });
      }

      const orderItems = userCart.items.map(cartItem => {
        const { product, service, quantity } = cartItem;
        const item = product || service;
        const { price, taxCategory } = item;

        const itemPrice = price * quantity;
        let itemTax = 0;

        // Calculate tax based on taxCategory
        switch (taxCategory) {
          case 'PA':
            itemTax = calculateTax(itemPrice, 12);
            break;
          case 'PB':
            itemTax = calculateTax(itemPrice, 18);
            break;
          case 'PC':
            itemTax = 200;
            break;
          case 'SA':
            itemTax = calculateTax(itemPrice, 10);
            break;
          case 'SB':
            itemTax = calculateTax(itemPrice, 15);
            break;
          case 'SC':
            itemTax = 100;
            break;
        }

        const itemTotal = itemPrice + itemTax;

        return {
          product: product ? product._id : null,
          service: service ? service._id : null,
          quantity,
          price: itemPrice,
          tax: itemTax,
          total: itemTotal,
        };
      });

      // Create new order
      const newOrder = await Order.create({
        userId,
        items: orderItems,
      });

      // Clear cart
      await Cart.findOneAndDelete({ userId });

      res.status(201).json(newOrder);
    } catch (error) {
      res.status(500).json({ error: 'Failed to confirm order.' });
    }
  },
};

module.exports = orderController;
