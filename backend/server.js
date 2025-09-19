const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // Corrected to body-parser

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  // In real app, check DB
  if (email && password) {
    res.json({ message: 'Login successful' });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/register', (req, res) => {
  const { firstName, lastName, email, phone, company, businessType, password, confirmPassword, country } = req.body;
  if (password !== confirmPassword) {
    res.status(400).json({ message: 'Passwords do not match' });
  } else {
    res.json({ message: 'Registration successful' });
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});