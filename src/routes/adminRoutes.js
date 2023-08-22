const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/orders', adminController.getAllOrders);

module.exports = router;