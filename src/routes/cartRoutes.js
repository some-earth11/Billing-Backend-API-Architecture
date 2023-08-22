const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');


router.post('/add', cartController.addToCart);
router.post('/clear', cartController.clearCart);
router.post('/remove', cartController.removeFromCart);
router.get('/items', cartController.getCartItems);


module.exports = router;
