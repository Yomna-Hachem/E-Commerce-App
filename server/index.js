// index.js
const express = require('express');
const cors = require('cors');
const path = require('path');  
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Hello from the backend!'));
app.use('/products', productRoutes);
app.use('/auth',authRoutes);


app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
