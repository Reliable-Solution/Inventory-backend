const express = require('express');
const { createSaleOrder } = require('../controllers/saleOrderController');
const router = express.Router();

router.post('/create-salesorder', createSaleOrder)

module.exports = router;