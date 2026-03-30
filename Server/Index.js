const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/by-lolita-with-love', { useNewUrlParser: true, useUnifiedTopology: true });

const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  price: String
});

const Product = mongoose.model('Product', productSchema);

app.get('/api/products', (req, res) => {
  Product.find()
    .then(products => {
      res.json(products);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error fetching products' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});