const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/confirm', orderController.confirmOrder);

module.exports = router;
