const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT  || 3000;
const URL = process.env.MONGOURL ;

app.use(bodyParser.json());

//ROUTES
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

app.use('/api/users', userRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/services', serviceRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/admin', adminRoutes);

//MONGODB
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    })
    })
  .catch((err) => {
    console.error('Error', err);
  });
