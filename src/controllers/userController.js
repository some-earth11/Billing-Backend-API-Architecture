const User = require('../models/User');

const userController = {
  createUser: async (req, res) => {
    try {
      const newUser = await User.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user account.' });
    }
  },
};

module.exports = userController;