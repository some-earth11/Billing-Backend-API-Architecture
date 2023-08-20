const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: String,
    price: Number,
    taxCategory: String,
  });

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;