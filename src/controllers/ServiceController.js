const Service = require('../models/Service');

const serviceController = {
  createService: async (req, res) => {
    try {
      const { name, price, taxCategory } = req.body;
      const newService = await Service.create({ name, price, taxCategory });
      res.status(201).json(newService);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create service.' });
    }
  },

  getAllServices: async (req, res) => {
    try {
      const services = await Service.find();
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch services.' });
    }
  },
};

module.exports = serviceController;
