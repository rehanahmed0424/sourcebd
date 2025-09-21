import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('/api/products')
      .then(res => {
        setProducts(res.data);
        setError('');
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]); // Render without products
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="text-3xl font-bold text-green-700">Source<span className="text-orange-500">Bd</span></div>
            <div className="flex-grow mx-8 relative">
              <input type="text" placeholder="Search for products..." className="w-full p-3 rounded-full border" />
            </div>
            <div className="flex items-center gap-5">
              {isAuthenticated ? (
                <div className="relative">
                  <button className="flex items-center gap-2 text-gray-700">
                    <i className="fas fa-user"></i> {user?.name}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                    <Link to="/user-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-1 text-gray-700"><i className="fas fa-user"></i> Sign In</Link>
              )}
              <Link to="/cart" className="flex items-center gap-1 text-gray-700"><i className="fas fa-shopping-cart"></i> Cart</Link>
              <Link to="/help" className="flex items-center gap-1 text-gray-700"><i className="fas fa-question-circle"></i> Help</Link>
            </div>
          </div>
        </div>
        <nav className="bg-green-700 py-3">
          <div className="container mx-auto px-4">
            <ul className="flex list-none gap-8">
              <li><Link to="/category" className="text-white font-medium">All Categories</Link></li>
              <li><Link to="/category" className="text-white font-medium">Textile & Leather</Link></li>
              <li><Link to="/category" className="text-white font-medium">Agriculture</Link></li>
              <li><Link to="/category" className="text-white font-medium">Electronics</Link></li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-green-700 text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">Bangladesh's Premier B2B Marketplace</h1>
            <p className="text-xl mb-8 opacity-90">Connect with verified suppliers, source quality products, and grow your business with SourceBd</p>
            <div className="flex justify-center gap-4">
              <Link to="/register" className="inline-block bg-white text-green-700 py-3 px-6 rounded font-semibold hover:bg-gray-100">Start Sourcing</Link>
              <Link to="/register" className="inline-block bg-transparent border-2 border-white text-white py-3 px-6 rounded font-semibold hover:bg-white hover:text-green-700">Become a Supplier</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-700 mb-4">Browse by Categories</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Explore products across various industries from verified Bangladeshi suppliers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded shadow-md text-center p-4">
              <i className="fas fa-tshirt text-6xl text-green-700 mb-4"></i>
              <h3 className="font-bold mb-2">Textile & Apparel</h3>
              <p className="text-gray-600">Garments, fabrics, yarns and accessories</p>
            </div>
            <div className="bg-white rounded shadow-md text-center p-4">
              <i className="fas fa-seedling text-6xl text-green-700 mb-4"></i>
              <h3 className="font-bold mb-2">Agriculture</h3>
              <p className="text-gray-600">Fresh produce, processed foods, spices</p>
            </div>
            <div className="bg-white rounded shadow-md text-center p-4">
              <i className="fas fa-microchip text-6xl text-green-700 mb-4"></i>
              <h3 className="font-bold mb-2">Electronics</h3>
              <p className="text-gray-600">Consumer electronics, components, gadgets</p>
            </div>
            <div className="bg-white rounded shadow-md text-center p-4">
              <i className="fas fa-industry text-6xl text-green-700 mb-4"></i>
              <h3 className="font-bold mb-2">Machinery</h3>
              <p className="text-gray-600">Industrial equipment, tools, parts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-700 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Quality products from verified suppliers across Bangladesh</p>
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map(product => (
                <div key={product._id} className="bg-white rounded shadow-md p-4">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
                  <h3 className="font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">{product.description}</p>
                  <p className="text-green-700 font-bold mb-2">{product.priceRange}</p>
                  <p className="text-sm text-gray-500">MOQ: {product.moq}</p>
                  <div className="mt-4 flex justify-between">
                    <Link to="/rfq" className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">Request Quote</Link>
                    <button className="text-gray-500 hover:text-red-500"><i className="far fa-heart"></i></button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No products available.</p>
            )}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-700 mb-4">How SourceBd Works</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Simple steps to source products from Bangladeshi suppliers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded shadow-md p-6">
              <div className="w-12 h-12 bg-green-700 text-white rounded-full flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="font-bold mb-2">Search Products</h3>
              <p className="text-gray-600">Browse through thousands of products from verified suppliers across Bangladesh.</p>
            </div>
            <div className="bg-white rounded shadow-md p-6">
              <div className="w-12 h-12 bg-green-700 text-white rounded-full flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="font-bold mb-2">Request Quotes</h3>
              <p className="text-gray-600">Send quotation requests to multiple suppliers with your specific requirements.</p>
            </div>
            <div className="bg-white rounded shadow-md p-6">
              <div className="w-12 h-12 bg-green-700 text-white rounded-full flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="font-bold mb-2">Compare & Negotiate</h3>
              <p className="text-gray-600">Receive quotes, compare offers, and negotiate directly with suppliers.</p>
            </div>
            <div className="bg-white rounded shadow-md p-6">
              <div className="w-12 h-12 bg-green-700 text-white rounded-full flex items-center justify-center mb-4">
                4
              </div>
              <h3 className="font-bold mb-2">Secure Payment & Ship</h3>
              <p className="text-gray-600">Use our secure payment system and arrange shipping with trusted partners.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-700 mb-4">What Our Buyers Say</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Hear from businesses that have successfully sourced through SourceBd</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded shadow-md p-6">
              <p className="italic text-gray-600 mb-4">"SourceBd has transformed how we source products from Bangladesh. The platform is easy to use, and we've found reliable suppliers for our textile business."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-user"></i>
                </div>
                <div>
                  <h4 className="font-bold">Ahmed Rahman</h4>
                  <p className="text-gray-500">Fashion Importer, UK</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded shadow-md p-6">
              <p className="italic text-gray-600 mb-4">"As a small business owner, finding trustworthy suppliers was always a challenge. SourceBd's verification system gives me confidence in my sourcing decisions."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-user"></i>
                </div>
                <div>
                  <h4 className="font-bold">Sarah Johnson</h4>
                  <p className="text-gray-500">Boutique Owner, Australia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-700 text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Ready to Source from Bangladesh?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">Join thousands of businesses that have discovered quality products and reliable suppliers through SourceBd</p>
          <Link to="/register" className="inline-block bg-white text-green-700 py-3 px-6 rounded font-semibold hover:bg-gray-100">Create Free Account</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SourceBd</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">For Buyers</h3>
              <ul className="space-y-2">
                <li><Link to="/category" className="text-gray-300 hover:text-white">Browse Categories</Link></li>
                <li><Link to="/rfq" className="text-gray-300 hover:text-white">Submit RFQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Suppliers</h3>
              <ul className="space-y-2">
                <li><Link to="/supplier" className="text-gray-300 hover:text-white">Become Supplier</Link></li>
                <li><Link to="/help" className="text-gray-300 hover:text-white">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Stay Connected</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-300 hover:text-white">Facebook</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white">LinkedIn</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            &copy; 2025 SourceBd - Bangladesh's Premier B2B Marketplace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;