const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const songRoutes = require('./routes/songs');
const path = require('path');
 
require('dotenv').config();
 
const app = express();
  
// Connect to DB
connectDB();   
 
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
// Middleware  
app.use(cors());
app.use(express.json());
app.use('/api/songs', songRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
