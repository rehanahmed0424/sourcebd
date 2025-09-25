require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');

// Initialize express app FIRST
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
  origin: 'http://localhost:5173',
  credentials: true 
}));
app.use('/uploads', express.static('uploads'));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// MongoDB connection
mongoose.connect('mongodb+srv://sourcebduser:sourcebdpass@cluster0.uzynynf.mongodb.net/sourcebd?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// User Model
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  country: { type: String, default: 'Bangladesh' },
  password: { type: String, required: true },
  userType: { type: String, enum: ['buyer', 'supplier'], default: 'buyer' },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// Category Model
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  items: [String],
});
const Category = mongoose.model('Category', categorySchema);

// Product Model
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  supplier: String,
  priceRange: String,
  moq: Number,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  image: String,
  verified: { type: Boolean, default: false },
});
const Product = mongoose.model('Product', productSchema);

// Testimonial Model
const testimonialSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: String,
});
const Testimonial = mongoose.model('Testimonial', testimonialSchema);

// ===== ROUTES =====

// Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    
    const { firstName, lastName, email, phone, country, password, confirmPassword } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      country,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    res.json({ 
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET endpoints
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/featured', async (req, res) => {
  try {
    const products = await Product.find({ verified: true }).populate('categoryId', 'name');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST endpoints
app.post('/api/categories', upload.none(), (req, res) => {
  console.log('Received body:', req.body);
  try {
    const { name, description, items } = req.body;
    if (!name || !items) {
      return res.status(400).json({ error: 'Name and items are required' });
    }
    const category = new Category({ name, description, items: JSON.parse(items) });
    category.save()
      .then(savedCategory => res.status(201).json(savedCategory))
      .catch(err => res.status(400).json({ error: err.message }));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/products', upload.single('image'), (req, res) => {
  console.log('Received body:', req.body);
  try {
    const { name, supplier, priceRange, moq, categoryId, verified } = req.body;
    if (!name || !categoryId) {
      return res.status(400).json({ error: 'Name and categoryId are required' });
    }

    Category.findById(categoryId)
      .then(category => {
        if (!category) {
          return res.status(400).json({ error: 'Category not found' });
        }
        const image = req.file ? `/uploads/${req.file.filename}` : '';
        const product = new Product({
          name,
          supplier,
          priceRange,
          moq: parseInt(moq) || 1,
          categoryId,
          image,
          verified: verified === 'true',
        });
        return product.save();
      })
      .then(savedProduct => res.status(201).json(savedProduct))
      .catch(err => res.status(400).json({ error: err.message }));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/testimonials', upload.none(), (req, res) => {
  console.log('Received body:', req.body);
  try {
    const { text, author } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    const testimonial = new Testimonial({ text, author });
    testimonial.save()
      .then(savedTestimonial => res.status(201).json(savedTestimonial))
      .catch(err => res.status(400).json({ error: err.message }));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));