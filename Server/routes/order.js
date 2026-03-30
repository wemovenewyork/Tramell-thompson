const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/orders', (req, res) => {
  const order = new Order(req.body);
  order.save()
    .then((order) => {
      res.json(order);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Error creating order' });
    });
});

module.exports = router;