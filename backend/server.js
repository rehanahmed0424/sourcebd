require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// Initialize express app FIRST
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Fix: Serve static files from the correct path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

// Improved Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Keep original extension for better compatibility
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  // Check if the file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// MongoDB connection
mongoose.connect('mongodb+srv://sourcebduser:sourcebdpass@cluster0.uzynynf.mongodb.net/sourcebd?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    console.log('⚠️  Continuing with fallback data...');
  });

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

// Updated Category Model (removed items, added image)
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String, // Added image field
});
const Category = mongoose.model('Category', categorySchema);

// Updated Product Model with featured field
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  supplier: String,
  priceRange: String,
  moq: Number,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  image: String,
  verified: { type: Boolean, default: false },
  featured: { type: Boolean, default: false }, // Added featured field
});
const Product = mongoose.model('Product', productSchema);

// Testimonial Model
const testimonialSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: String,
});
const Testimonial = mongoose.model('Testimonial', testimonialSchema);

// ===== AUTHENTICATION ROUTES =====

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

// ===== CATEGORY ROUTES =====

// GET all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error('Categories fetch error:', err);
    // Return empty array instead of error for better frontend experience
    res.json([]);
  }
});

// POST new category (updated to handle image upload)
app.post('/api/categories', upload.single('image'), async (req, res) => {
  try {
    console.log('Received category data:', req.body);
    console.log('Received file:', req.file);
    
    const { name, description } = req.body;
    
    // Validation
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    // Handle image upload - Fix: Use absolute path
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Create new category
    const newCategory = new Category({
      name,
      description,
      image
    });

    await newCategory.save();

    res.status(201).json({ 
      message: 'Category added successfully',
      category: newCategory
    });

  } catch (error) {
    console.error('Category creation error:', error);
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size too large. Maximum 5MB allowed.' });
      }
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE category
app.delete('/api/categories/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Delete associated image file if exists
    if (category.image) {
      const imagePath = path.join(__dirname, category.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Category.findByIdAndDelete(req.params.id);
    
    // Also delete all products in this category
    await Product.deleteMany({ categoryId: req.params.id });
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Category deletion error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ===== PRODUCT ROUTES =====

// GET featured products (updated to only return featured products)
app.get('/api/products/featured', async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).populate('categoryId', 'name');
    res.json(products);
  } catch (err) {
    console.error('Featured products fetch error:', err);
    // Return empty array instead of error
    res.json([]);
  }
});

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().populate('categoryId', 'name');
    res.json(products);
  } catch (err) {
    console.error('Products fetch error:', err);
    res.json([]);
  }
});

// POST new product (updated to handle featured field)
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    console.log('Received product data:', req.body);
    console.log('Received file:', req.file);
    
    const { name, supplier, priceRange, moq, categoryId, verified, featured } = req.body;
    
    // Validation
    if (!name || !categoryId) {
      return res.status(400).json({ error: 'Product name and category are required' });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ error: 'Category not found' });
    }

    // Handle image upload - Fix: Use absolute path
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Create new product
    const newProduct = new Product({
      name,
      supplier,
      priceRange,
      moq: parseInt(moq) || 1,
      categoryId,
      image,
      verified: verified === 'true',
      featured: featured === 'true' // Handle featured field
    });

    await newProduct.save();

    // Populate category name in response
    await newProduct.populate('categoryId', 'name');

    res.status(201).json({ 
      message: 'Product added successfully',
      product: newProduct
    });

  } catch (error) {
    console.error('Product creation error:', error);
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size too large. Maximum 5MB allowed.' });
      }
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete associated image file if exists
    if (product.image) {
      const imagePath = path.join(__dirname, product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Product deletion error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ===== TESTIMONIAL ROUTES =====

// GET all testimonials
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    console.error('Testimonials fetch error:', err);
    res.json([]);
  }
});

// POST new testimonial - FIX: Use upload.none() to handle form data
app.post('/api/testimonials', upload.none(), async (req, res) => {
  try {
    console.log('Received testimonial data:', req.body);
    
    const { text, author } = req.body;
    
    // Validation
    if (!text || !author) {
      return res.status(400).json({ error: 'Testimonial text and author are required' });
    }

    // Create new testimonial
    const newTestimonial = new Testimonial({
      text,
      author
    });

    await newTestimonial.save();

    res.status(201).json({ 
      message: 'Testimonial added successfully',
      testimonial: newTestimonial
    });

  } catch (error) {
    console.error('Testimonial creation error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// DELETE testimonial
app.delete('/api/testimonials/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Testimonial deletion error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ===== USER PROFILE ROUTES =====

// GET user profile
app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== HEALTH CHECK =====

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// ===== FALLBACK DATA ENDPOINTS =====

// Get fallback categories
app.get('/api/fallback/categories', (req, res) => {
  const fallbackCategories = [
    { 
      _id: '1', 
      name: "Textile & Apparel", 
      description: "Garments, fabrics, yarns and accessories",
      image: "/images/textile.jpg"
    },
    { 
      _id: '2', 
      name: "Agriculture", 
      description: "Fresh produce, processed foods, spices",
      image: "/images/agriculture.jpg"
    },
    { 
      _id: '3', 
      name: "Electronics", 
      description: "Consumer electronics, components, gadgets",
      image: "/images/electronics.jpg"
    },
    { 
      _id: '4', 
      name: "Machinery", 
      description: "Industrial equipment, tools, parts",
      image: "/images/machinery.jpg"
    },
  ];
  res.json(fallbackCategories);
});

// Get fallback featured products
app.get('/api/fallback/products/featured', (req, res) => {
  const fallbackProducts = [
    { _id: '1', name: "Eco-Friendly Jute Bags", supplier: "Dhaka Jute Mills Ltd.", priceRange: "$2.50 - $4.00", moq: 500, image: "/images/jute-bags.jpg", verified: true, featured: true },
    { _id: '2', name: "100% Cotton T-Shirts", supplier: "Chittagong Textiles", priceRange: "$4.20 - $6.50", moq: 100, image: "/images/tshirts.jpg", verified: true, featured: true },
    { _id: '3', name: "Genuine Leather Wallets", supplier: "Sylhet Leather Co.", priceRange: "$8.00 - $12.00", moq: 50, image: "/images/leather.jpg", verified: false, featured: true },
    { _id: '4', name: "Ceramic Dinner Set", supplier: "Rajshahi Ceramics", priceRange: "$25.00 - $40.00", moq: 20, image: "/images/ceramics.jpg", verified: true, featured: true },
  ];
  res.json(fallbackProducts);
});

// Get fallback testimonials
app.get('/api/fallback/testimonials', (req, res) => {
  const fallbackTestimonials = [
    { _id: '1', text: "SourceBd has transformed how we source products from Bangladesh. The platform is easy to use, and we've found reliable suppliers for our textile business.", author: "Ahmed Rahman, Fashion Importer, UK" },
    { _id: '2', text: "As a small business owner, finding trustworthy suppliers was always a challenge. SourceBd's verification system gives me confidence in my sourcing decisions.", author: "Sarah Johnson, Boutique Owner, Australia" },
  ];
  res.json(fallbackTestimonials);
});

// ===== ERROR HANDLING =====

// Custom 404 handler for API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  next();
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum 5MB allowed.' });
    }
  }
  
  res.status(500).json({ error: 'Something went wrong!' });
});

// Handle all other routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 API Base: http://localhost:${PORT}/api`);
});