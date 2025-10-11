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

// Product Model with Tiered Pricing
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  supplier: String,
  tieredPricing: [{
    minQty: { type: Number, required: true },
    maxQty: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  moq: Number,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  image: String,
  verified: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  description: String,
  specifications: {
    material: String,
    size: String,
    weightCapacity: String,
    leadTime: String,
    customization: String,
    handleLength: String,
    printingMethod: String,
    colorOptions: String,
    packaging: String
  },
  reviewCount: { type: Number, default: 0 },
  orderCount: { type: Number, default: 0 }
});
const Product = mongoose.model('Product', productSchema);

// Testimonial Model
const testimonialSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: String,
});
const Testimonial = mongoose.model('Testimonial', testimonialSchema);

// Inquiry Model
const inquirySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: String,
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: String,
  phone: String,
  message: String,
  quantity: { type: Number, required: true },
  status: { type: String, default: 'pending' }, // pending, contacted, closed
  createdAt: { type: Date, default: Date.now }
});
const Inquiry = mongoose.model('Inquiry', inquirySchema);

// Cart Model
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    addedAt: { type: Date, default: Date.now }
  }],
  updatedAt: { type: Date, default: Date.now }
});
const Cart = mongoose.model('Cart', cartSchema);

// Wishlist Model
const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    addedAt: { type: Date, default: Date.now }
  }],
  updatedAt: { type: Date, default: Date.now }
});
const Wishlist = mongoose.model('Wishlist', wishlistSchema);

// JWT Secret
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

// Email Configuration
const createTransporter = async () => {
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
  
  console.log('🔧 Creating Ethereal test email account (fallback)...');
  const testAccount = await nodemailer.createTestAccount();
  console.log('✅ Ethereal account created:', testAccount.user);
  
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

// Email Sending Function
const sendOTPEmail = async (email, otp) => {
  try {
    console.log('📧 Attempting to send OTP email to:', email);
    
    const transporter = await createTransporter();
    await transporter.verify();

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
                body { font-family: Arial, sans-serif; background-color: #f5f7f9; margin: 0; padding: 20px; line-height: 1.6; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: #2d4d31; color: white; padding: 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 28px; }
                .content { padding: 30px; }
                .otp-box { background: #f8f9fa; border: 2px dashed #2d4d31; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                .otp-code { font-size: 32px; font-weight: bold; color: #2d4d31; letter-spacing: 5px; margin: 15px 0; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
                .note { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 15px 0; color: #856404; }
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
    
    if (info.messageId && nodemailer.getTestMessageUrl) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('✅ OTP email sent successfully to:', email);
      console.log('📧 Preview URL:', previewUrl);
    } else {
      console.log('✅ OTP email sent successfully to:', email);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    console.log('\n⚠️  Email sending failed! OTP for testing:', otp);
    return false;
  }
};

// ===== AUTHENTICATION ROUTES =====

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

app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
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

    res.json({ 
      success: true,
      message: 'If an account with that email exists, an OTP has been sent.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
});

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

// Get single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoryId', 'name');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Product fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// In server.js - Completely rewrite the product creation route
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    console.log('=== PRODUCT CREATION REQUEST ===');
    console.log('Request body keys:', Object.keys(req.body));
    
    // Log all form fields for debugging
    console.log('All form fields:');
    Object.keys(req.body).forEach(key => {
      console.log(`${key}:`, req.body[key]);
    });

    const { 
      name, supplier, moq, categoryId, 
      verified, featured, description, reviewCount, orderCount
    } = req.body;
    
    // Basic validation
    if (!name || !categoryId) {
      return res.status(400).json({ error: 'Product name and category are required' });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ error: 'Category not found' });
    }

    // Handle image
    const image = req.file ? req.file.filename : null;

    // Parse tiered pricing - NEW APPROACH
    const tieredPricing = [];
    console.log('=== PARSING TIERED PRICING ===');
    
    // Look for tiered pricing fields with dot notation
    const tierKeys = Object.keys(req.body).filter(key => key.startsWith('tieredPricing['));
    console.log('Found tier keys:', tierKeys);
    
    // Group by index
    const tiersByIndex = {};
    
    tierKeys.forEach(key => {
      // Extract index and field name from key like "tieredPricing[0].minQty"
      const match = key.match(/tieredPricing\[(\d+)\]\.(\w+)/);
      if (match) {
        const index = match[1];
        const field = match[2];
        const value = req.body[key];
        
        if (!tiersByIndex[index]) {
          tiersByIndex[index] = {};
        }
        tiersByIndex[index][field] = value;
      }
    });
    
    console.log('Tiers by index:', tiersByIndex);
    
    // Process each tier
    Object.keys(tiersByIndex).forEach(index => {
      const tier = tiersByIndex[index];
      console.log(`Processing tier ${index}:`, tier);
      
      if (tier.price && tier.price > 0) {
        const minQty = parseInt(tier.minQty) || 1;
        const maxQty = parseInt(tier.maxQty) || 0;
        const price = parseFloat(tier.price);
        
        if (!isNaN(price) && price > 0) {
          tieredPricing.push({
            minQty: minQty,
            maxQty: maxQty,
            price: price
          });
          console.log(`✅ Added tier ${index}:`, { minQty, maxQty, price });
        }
      }
    });

    console.log('Final tiered pricing:', tieredPricing);

    // Validate tiered pricing
    if (tieredPricing.length === 0) {
      return res.status(400).json({ error: 'At least one valid price tier is required' });
    }

    // Build specifications
    const specifications = {};
    const specFields = [
      'material', 'size', 'weightCapacity', 'leadTime', 'customization',
      'handleLength', 'printingMethod', 'colorOptions', 'packaging'
    ];
    
    specFields.forEach(field => {
      const value = req.body[`specifications[${field}]`];
      if (value && value.trim() !== '') {
        specifications[field] = value.trim();
      }
    });

    console.log('Specifications:', specifications);

    // Create product data
    const productData = {
      name: name,
      supplier: supplier,
      tieredPricing: tieredPricing,
      moq: parseInt(moq) || 1,
      categoryId: categoryId,
      image: image,
      verified: verified === 'true' || verified === true,
      featured: featured === 'true' || featured === true,
      description: description || '',
      reviewCount: parseInt(reviewCount) || 0,
      orderCount: parseInt(orderCount) || 0,
      specifications: specifications
    };

    console.log('Final product data:', productData);

    // Create and save product
    const newProduct = new Product(productData);
    await newProduct.save();
    await newProduct.populate('categoryId', 'name');

    console.log('✅ Product created successfully:', newProduct._id);

    res.status(201).json({ 
      message: 'Product added successfully',
      product: newProduct
    });

  } catch (error) {
    console.error('❌ Product creation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
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

// ===== INQUIRY ROUTES =====
app.post('/api/inquiries', async (req, res) => {
  try {
    const { productId, productName, name, email, company, phone, message, quantity } = req.body;

    if (!productId || !name || !email || !quantity) {
      return res.status(400).json({ error: 'Product, name, email, and quantity are required' });
    }

    const newInquiry = new Inquiry({
      productId,
      productName,
      name,
      email,
      company,
      phone,
      message,
      quantity
    });

    await newInquiry.save();

    res.status(201).json({ 
      message: 'Inquiry submitted successfully',
      inquiry: newInquiry
    });

  } catch (error) {
    console.error('Inquiry creation error:', error);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

// ===== CART ROUTES =====
app.get('/api/cart/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })
      .populate('items.productId');
    res.json(cart || { items: [] });
  } catch (error) {
    console.error('Cart fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

app.post('/api/cart/:userId', async (req, res) => {
  try {
    const { productId, quantity, unitPrice } = req.body;

    let cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      cart = new Cart({ userId: req.params.userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        unitPrice
      });
    }

    cart.updatedAt = new Date();
    await cart.save();
    await cart.populate('items.productId');

    res.json({ 
      message: 'Item added to cart',
      cart 
    });

  } catch (error) {
    console.error('Cart update error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// ===== WISHLIST ROUTES =====
app.get('/api/wishlist/:userId', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId })
      .populate('products.productId');
    res.json(wishlist || { products: [] });
  } catch (error) {
    console.error('Wishlist fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

app.post('/api/wishlist/:userId', async (req, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ userId: req.params.userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.params.userId, products: [] });
    }

    const existingProductIndex = wishlist.products.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingProductIndex > -1) {
      // Remove from wishlist if already exists
      wishlist.products.splice(existingProductIndex, 1);
    } else {
      // Add to wishlist
      wishlist.products.push({ productId });
    }

    wishlist.updatedAt = new Date();
    await wishlist.save();
    await wishlist.populate('products.productId');

    res.json({ 
      message: 'Wishlist updated',
      wishlist 
    });

  } catch (error) {
    console.error('Wishlist update error:', error);
    res.status(500).json({ error: 'Failed to update wishlist' });
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
app.get('/api/search', async (req, res) => {
  try {
    const { q: query, category, minPrice, maxPrice, sortBy, verified, featured } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchTerm = query.trim();
    console.log('🔍 Enhanced search for:', searchTerm);

    let searchQuery = {
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { supplier: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ]
    };

    const matchingCategories = await Category.find({
      name: { $regex: searchTerm, $options: 'i' }
    });

    if (matchingCategories.length > 0) {
      searchQuery.$or.push({
        categoryId: { $in: matchingCategories.map(cat => cat._id) }
      });
    }

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

    let sortOptions = {};
    switch (sortBy) {
      case 'price-low':
        sortOptions = { 'tieredPricing.price': 1 };
        break;
      case 'price-high':
        sortOptions = { 'tieredPricing.price': -1 };
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

    const products = await Product.find(searchQuery)
      .populate('categoryId', 'name')
      .sort(sortOptions);

    const allCategories = await Category.find();

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
    }
  ];
  res.json(fallbackCategories);
});

app.get('/api/fallback/products/featured', (req, res) => {
  const fallbackProducts = [
    { 
      _id: '1', 
      name: "Eco-Friendly Jute Bags", 
      supplier: "Dhaka Jute Mills Ltd.", 
      tieredPricing: [
        { minQty: 1, maxQty: 100, price: 4.00 },
        { minQty: 101, maxQty: 500, price: 3.50 },
        { minQty: 501, maxQty: 0, price: 2.50 }
      ],
      moq: 500, 
      image: "/images/jute-bags.jpg", 
      verified: true, 
      featured: true 
    }
  ];
  res.json(fallbackProducts);
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
});