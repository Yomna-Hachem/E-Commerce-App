import React from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // includes carousel, modal, etc.

import HomePage from './pages/HomePage';
import Header from './components/Header'; 
import AuthContainer from './pages/Authentication';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { ProductProvider } from './context/ProductContext';
import { CartDataProvider } from './context/CartDataContext';
import './App.css';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import ProductDetails from './components/ProductDetails';
import SearchPage from './pages/SearchPage';
import Profile from './components/Profile';



function App() {
const [message, setMessage] = useState('');
const [error, setError] = useState(null);


  useEffect(() => {
    console.log('Sending fetch request...');
    fetch('http://localhost:5001/')
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => {
        console.error('Error:', err);
        setError('Failed to fetch data');
      });
  }, []);
  console.log("returning elements");

  return (
    
    <CartProvider>
    <UserProvider> 
    <ProductProvider>
    <CartDataProvider>
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/AuthContainer" element={<AuthContainer />} /> 
        <Route path="/Products" element={<ProductList />} /> 
        <Route path="/Cart" element={<Cart />} /> 
        <Route path="/ProductDetails/:id" element={<ProductDetails />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router> 
    </CartDataProvider>
    </ProductProvider>
    </UserProvider> 
    </CartProvider>

  );
}

export default App;
