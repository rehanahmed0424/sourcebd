const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors({ origin: 'http://localhost:5173' })); // Allow frontend origin
app.use('/uploads', express.static('uploads')); // Serve uploaded images

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

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
  console.log('Received body:', req.body); // Debug log
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
  console.log('Received body:', req.body); // Debug log
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
  console.log('Received body:', req.body); // Debug log
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

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/sourcebd', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));