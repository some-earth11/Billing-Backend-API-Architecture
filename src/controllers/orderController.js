const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');

const orderController = {
  confirmOrder: async (req, res) => {
    try {
      const { userId } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const userCart = await Cart.findOne({ userId }).populate('items.product items.service');

      if (!userCart || userCart.items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty. Cannot confirm order.' });
      }

      let totalPrice = 0;
      for (const cartItem of userCart.items) {
        const { product, service, quantity } = cartItem;
        const item = product || service;
        const itemPrice = item.price * quantity;
        totalPrice += itemPrice;
      }

      // Create an order
      const newOrder = await Order.create({
        userId,
        items: userCart.items,
        totalPrice,
      });

      // Clear the cart
      await Cart.findOneAndDelete({ userId });

      res.status(201).json({ message: 'Order confirmed successfully.', order: newOrder });
    } catch (error) {
      res.status(500).json({ error: 'Failed to confirm order.' });
    }
  },
};

module.exports = orderController;
