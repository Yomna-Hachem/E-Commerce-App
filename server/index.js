// index.js
const express = require('express');
const cors = require('cors');
const path = require('path');  
const cookieParser = require('cookie-parser');
require('dotenv').config(); 

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const uploadRoutes = require('./routes/uploadRoutes');


const app = express();
const PORT = 5001;
const morgan=require('morgan');
app.use(morgan('dev'));
// app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // React app origin
  credentials: true
}));


app.get('/', (req, res) => res.send('Hello from the backend!'));
app.use('/products', productRoutes);
app.use('/auth',authRoutes)
app.use('/cart', cartRoutes);
app.use('/upload', uploadRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
