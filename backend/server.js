const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const JWT_SECRET = process.env.JWT_SECRET;

// User Model
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  company: String,
  businessType: String,
  country: String,
  role: { type: String, enum: ['buyer', 'supplier'], default: 'buyer' },
  verified: { type: Boolean, default: false },
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, company, businessType, country } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const user = new User({ firstName, lastName, email, password, phone, company, businessType, country });
    await user.save();
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, name: `${firstName} ${lastName}` } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: `${user.firstName} ${user.lastName}` } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Forgot Password endpoint (basic, for OTP)
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    // In production, send OTP via email (use nodemailer)
    console.log(`OTP for ${email}: ${otp}`); // Temporary log
    res.json({ success: true, message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset Password endpoint
app.post('/api/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    // In production, verify OTP from DB
    if (otp !== '123456') { // Temporary OTP check
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Product Model
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  priceRange: String,
  moq: Number,
  category: String,
  image: String,
  supplier: String,
  verified: { type: Boolean, default: false },
});

const Product = mongoose.model('Product', productSchema);

// Get products endpoint
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({ verified: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed sample products (run once)
app.get('/api/seed-products', async (req, res) => {
  const sampleProducts = [
    { name: 'Eco-Friendly Jute Bags', description: 'Sustainable jute bags', priceRange: '$2.50 - $4.00', moq: 500, category: 'Textile', image: 'https://via.placeholder.com/250x200?text=Jute+Bags', supplier: 'Dhaka Jute Mills', verified: true },
    { name: '100% Cotton T-Shirts', description: 'High-quality cotton t-shirts', priceRange: '$4.20 - $6.50', moq: 100, category: 'Textile', image: 'https://via.placeholder.com/250x200?text=T-Shirts', supplier: 'Chittagong Textiles', verified: true },
  ];
  await Product.insertMany(sampleProducts);
  res.json({ message: 'Products seeded' });
});
app.listen(5000, () => console.log('Server running on port 5000'));