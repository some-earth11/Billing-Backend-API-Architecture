const Product = require('../models/Product');

const productController = {
  createProduct: async (req, res) => {
    try {
      const { name, price, taxCategory } = req.body;
      const newProduct = await Product.create({ name, price, taxCategory });
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create product.' });
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products.' });
    }
  },
};

module.exports = productController;
