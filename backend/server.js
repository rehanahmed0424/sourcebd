require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
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
    fileSize: 5 * 1024 * 1024,
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

// OTP Model for password reset
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const OTP = mongoose.model('OTP', otpSchema);

// Category Model
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
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
  featured: { type: Boolean, default: false },
});
const Product = mongoose.model('Product', productSchema);

// Testimonial Model
const testimonialSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: String,
});
const Testimonial = mongoose.model('Testimonial', testimonialSchema);

// JWT Secret - Using your existing secret
const JWT_SECRET = process.env.JWT_SECRET || 'sourcebd-jwt-secret-2024';

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id,
      email: user.email 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Email Configuration - Using Brevo (formerly Sendinblue)
const createTransporter = async () => {
  // If Brevo credentials are provided
  if (process.env.BREVO_USER && process.env.BREVO_PASS) {
    console.log('📧 Using Brevo SMTP for email delivery...');
    return nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS
      }
    });
  }
  
  // Fallback to Ethereal for testing
  console.log('🔧 Creating Ethereal test email account (fallback)...');
  const testAccount = await nodemailer.createTestAccount();
  console.log('✅ Ethereal account created:');
  console.log('   📧 Email:', testAccount.user);
  console.log('   🔐 Password:', testAccount.pass);
  console.log('   🌐 Web: https://ethereal.email');
  
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

// REAL Email Sending Function with Brevo
const sendOTPEmail = async (email, otp) => {
  try {
    console.log('📧 Attempting to send OTP email to:', email);
    
    const transporter = await createTransporter();
    
    // Verify transporter configuration
    await transporter.verify();
    console.log('✅ SMTP connection verified');

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"SourceBd" <noreply@sourcebd.com>',
      to: email,
      subject: 'Password Reset OTP - SourceBd',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    background-color: #f5f7f9; 
                    margin: 0; 
                    padding: 20px; 
                    line-height: 1.6;
                }
                .container { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background: white; 
                    border-radius: 10px; 
                    overflow: hidden; 
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
                }
                .header { 
                    background: #2d4d31; 
                    color: white; 
                    padding: 30px; 
                    text-align: center; 
                }
                .header h1 { 
                    margin: 0; 
                    font-size: 28px; 
                }
                .content { 
                    padding: 30px; 
                }
                .otp-box { 
                    background: #f8f9fa; 
                    border: 2px dashed #2d4d31; 
                    border-radius: 8px; 
                    padding: 20px; 
                    text-align: center; 
                    margin: 20px 0; 
                }
                .otp-code { 
                    font-size: 32px; 
                    font-weight: bold; 
                    color: #2d4d31; 
                    letter-spacing: 5px; 
                    margin: 15px 0;
                }
                .footer { 
                    background: #f8f9fa; 
                    padding: 20px; 
                    text-align: center; 
                    color: #666; 
                    font-size: 12px; 
                }
                .note {
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    border-radius: 5px;
                    padding: 15px;
                    margin: 15px 0;
                    color: #856404;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>SourceBd</h1>
                    <p>Bangladesh's Premier B2B Marketplace</p>
                </div>
                <div class="content">
                    <h2>Password Reset Request</h2>
                    <p>You requested to reset your password for your SourceBd account.</p>
                    
                    <div class="otp-box">
                        <p style="margin: 0 0 15px 0; color: #666;">Your One-Time Password (OTP) is:</p>
                        <div class="otp-code">${otp}</div>
                        <p style="margin: 15px 0 0 0; color: #666; font-size: 14px;">This OTP is valid for 10 minutes</p>
                    </div>
                    
                    <div class="note">
                        <strong>Note:</strong> Enter this code on the password reset page to complete the process.
                    </div>
                    
                    <p>If you didn't request this password reset, please ignore this email and your account will remain secure.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 SourceBd. All rights reserved.</p>
                    <p>This is an automated message, please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    // For Ethereal emails, show the preview URL
    if (info.messageId && nodemailer.getTestMessageUrl) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('✅ OTP email sent successfully to:', email);
      console.log('📧 Preview URL:', previewUrl);
      console.log('   (Using Ethereal test inbox)');
    } else {
      console.log('✅ OTP email sent successfully to:', email);
      console.log('📧 Message ID:', info.messageId);
      console.log('   (Using Brevo - real email delivery)');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    
    // Fallback: Log OTP to console for testing
    console.log('\n⚠️  Email sending failed! OTP for testing:');
    console.log(`📧 To: ${email}`);
    console.log(`🔐 OTP: ${otp}`);
    console.log('⏰ OTP valid for 10 minutes\n');
    
    return false;
  }
};

// ===== AUTHENTICATION ROUTES =====

// Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    
    const { firstName, lastName, email, phone, country, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      country,
      password: hashedPassword
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        country: newUser.country
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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.json({ 
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        country: user.country
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== PASSWORD RESET ROUTES =====

// Send OTP for password reset
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if user doesn't exist for security
      return res.json({ 
        success: true,
        message: 'If an account with that email exists, an OTP has been sent.'
      });
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OTP.deleteMany({ email });

    const otp = new OTP({
      email,
      otp: otpCode,
      expiresAt
    });

    await otp.save();

    const emailSent = await sendOTPEmail(email, otpCode);

    if (emailSent) {
      console.log(`✅ OTP sent successfully to: ${email}`);
    } else {
      console.log(`⚠️  OTP email failed for: ${email}, but OTP was saved for testing`);
    }

    res.json({ 
      success: true,
      message: 'If an account with that email exists, an OTP has been sent.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
});

// Verify OTP
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp || otp.length !== 6) {
      return res.status(400).json({ 
        error: 'Please provide a valid email and 6-digit OTP' 
      });
    }

    const otpRecord = await OTP.findOne({ 
      email, 
      otp,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ 
        error: 'Invalid or expired OTP. Please request a new one.' 
      });
    }

    res.json({ 
      success: true,
      message: 'OTP verified successfully' 
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP. Please try again.' });
  }
});

// Reset password with OTP
app.post('/api/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ 
        error: 'Email, OTP, and new password are required' 
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters long' 
      });
    }

    const otpRecord = await OTP.findOne({ 
      email, 
      otp,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ 
        error: 'Invalid or expired OTP. Please request a new one.' 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    await user.save();

    await OTP.deleteOne({ _id: otpRecord._id });

    console.log(`✅ Password reset successful for: ${email}`);

    res.json({ 
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password. Please try again.' });
  }
});

// ===== CATEGORY ROUTES =====
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error('Categories fetch error:', err);
    res.json([]);
  }
});

app.post('/api/categories', upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

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
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.image) {
      const imagePath = path.join(__dirname, category.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Category.findByIdAndDelete(req.params.id);
    await Product.deleteMany({ categoryId: req.params.id });
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Category deletion error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ===== PRODUCT ROUTES =====
app.get('/api/products/featured', async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).populate('categoryId', 'name');
    res.json(products);
  } catch (err) {
    console.error('Featured products fetch error:', err);
    res.json([]);
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().populate('categoryId', 'name');
    res.json(products);
  } catch (err) {
    console.error('Products fetch error:', err);
    res.json([]);
  }
});

app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { name, supplier, priceRange, moq, categoryId, verified, featured } = req.body;
    
    if (!name || !categoryId) {
      return res.status(400).json({ error: 'Product name and category are required' });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ error: 'Category not found' });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = new Product({
      name,
      supplier,
      priceRange,
      moq: parseInt(moq) || 1,
      categoryId,
      image,
      verified: verified === 'true',
      featured: featured === 'true'
    });

    await newProduct.save();
    await newProduct.populate('categoryId', 'name');

    res.status(201).json({ 
      message: 'Product added successfully',
      product: newProduct
    });

  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

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
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    console.error('Testimonials fetch error:', err);
    res.json([]);
  }
});

app.post('/api/testimonials', upload.none(), async (req, res) => {
  try {
    const { text, author } = req.body;
    
    if (!text || !author) {
      return res.status(400).json({ error: 'Testimonial text and author are required' });
    }

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

// ===== ENHANCED SEARCH ROUTES =====

// Enhanced search endpoint with category search and filtering
app.get('/api/search', async (req, res) => {
  try {
    const { q: query, category, minPrice, maxPrice, sortBy, verified, featured } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchTerm = query.trim();
    console.log('🔍 Enhanced search for:', searchTerm);

    // Build search query
    let searchQuery = {
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { supplier: { $regex: searchTerm, $options: 'i' } },
        { priceRange: { $regex: searchTerm, $options: 'i' } }
      ]
    };

    // Add category search - search in category names too
    const matchingCategories = await Category.find({
      name: { $regex: searchTerm, $options: 'i' }
    });

    if (matchingCategories.length > 0) {
      searchQuery.$or.push({
        categoryId: { $in: matchingCategories.map(cat => cat._id) }
      });
    }

    // Apply filters
    if (category && category !== 'all') {
      const categoryObj = await Category.findOne({ name: new RegExp(category, 'i') });
      if (categoryObj) {
        searchQuery.categoryId = categoryObj._id;
      }
    }

    if (verified === 'true') {
      searchQuery.verified = true;
    }

    if (featured === 'true') {
      searchQuery.featured = true;
    }

    // Price range filtering (basic implementation)
    if (minPrice || maxPrice) {
      // This is a simplified implementation - you might want to parse actual numbers
      searchQuery.priceRange = {};
      if (minPrice) {
        searchQuery.priceRange.$gte = minPrice;
      }
      if (maxPrice) {
        searchQuery.priceRange.$lte = maxPrice;
      }
    }

    // Build sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'price-low':
        sortOptions = { 'priceRange': 1 };
        break;
      case 'price-high':
        sortOptions = { 'priceRange': -1 };
        break;
      case 'name':
        sortOptions = { 'name': 1 };
        break;
      case 'featured':
        sortOptions = { 'featured': -1, 'verified': -1 };
        break;
      default:
        sortOptions = { 'featured': -1, 'verified': -1, 'name': 1 };
    }

    // Execute search
    const products = await Product.find(searchQuery)
      .populate('categoryId', 'name')
      .sort(sortOptions);

    // Get all categories for filters
    const allCategories = await Category.find();

    console.log('📦 Found products:', products.length);

    res.json({
      query: searchTerm,
      products: products,
      productCount: products.length,
      totalResults: products.length,
      categories: allCategories,
      filters: {
        category: category || 'all',
        minPrice: minPrice || '',
        maxPrice: maxPrice || '',
        sortBy: sortBy || 'relevance',
        verified: verified === 'true',
        featured: featured === 'true'
      }
    });

  } catch (error) {
    console.error('❌ Enhanced search error:', error);
    res.status(500).json({ error: 'Failed to perform search: ' + error.message });
  }
});

// Get all categories for search filters
app.get('/api/categories/search', async (req, res) => {
  try {
    const categories = await Category.find().select('name');
    res.json(categories);
  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});
// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    email: process.env.BREVO_USER ? 'Brevo SMTP - Real emails' : 'Ethereal - Testing'
  });
});

// ===== FALLBACK DATA ENDPOINTS =====
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

app.get('/api/fallback/products/featured', (req, res) => {
  const fallbackProducts = [
    { _id: '1', name: "Eco-Friendly Jute Bags", supplier: "Dhaka Jute Mills Ltd.", priceRange: "$2.50 - $4.00", moq: 500, image: "/images/jute-bags.jpg", verified: true, featured: true },
    { _id: '2', name: "100% Cotton T-Shirts", supplier: "Chittagong Textiles", priceRange: "$4.20 - $6.50", moq: 100, image: "/images/tshirts.jpg", verified: true, featured: true },
    { _id: '3', name: "Genuine Leather Wallets", supplier: "Sylhet Leather Co.", priceRange: "$8.00 - $12.00", moq: 50, image: "/images/leather.jpg", verified: false, featured: true },
    { _id: '4', name: "Ceramic Dinner Set", supplier: "Rajshahi Ceramics", priceRange: "$25.00 - $40.00", moq: 20, image: "/images/ceramics.jpg", verified: true, featured: true },
  ];
  res.json(fallbackProducts);
});

app.get('/api/fallback/testimonials', (req, res) => {
  const fallbackTestimonials = [
    { _id: '1', text: "SourceBd has transformed how we source products from Bangladesh. The platform is easy to use, and we've found reliable suppliers for our textile business.", author: "Ahmed Rahman, Fashion Importer, UK" },
    { _id: '2', text: "As a small business owner, finding trustworthy suppliers was always a challenge. SourceBd's verification system gives me confidence in my sourcing decisions.", author: "Sarah Johnson, Boutique Owner, Australia" },
  ];
  res.json(fallbackTestimonials);
});

// ===== ERROR HANDLING =====
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  next();
});

app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum 5MB allowed.' });
    }
  }
  
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 API Base: http://localhost:${PORT}/api`);
  console.log(`🔐 JWT Secret: Using your existing configuration`);
  
  if (process.env.BREVO_USER) {
    console.log(`📧 EMAIL SYSTEM: Using Brevo SMTP (Real emails to any address)`);
    console.log(`   • Free: 300 emails/day`);
    console.log(`   • No domain verification needed`);
  } else {
    console.log(`📧 EMAIL SYSTEM: Using Ethereal Email (Testing only)`);
    console.log(`   • Set up Brevo for real emails to any address`);
  }
});