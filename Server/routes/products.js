const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/api/products', (req, res) => {
  Product.find()
    .then(products => {
      res.json(products);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error fetching products' });
    });
});

module.exports = router;