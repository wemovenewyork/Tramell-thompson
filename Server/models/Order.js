const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: String,
  customerName: String,
  customerEmail: String,
  orderDate: String,
  totalCost: String,
  products: []
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;