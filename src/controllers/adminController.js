const Order = require('../models/Order');

const adminController = {
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find().populate('items.product items.service');
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders.' });
    }
  },
};

module.exports = adminController;
