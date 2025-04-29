import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Header from './components/Header'; 
import AuthContainer from './pages/Authentication';
import { CartProvider } from './context/CartContext';
import './App.css';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import ProductDetails from './components/ProductDetails';

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

  return (
    <CartProvider>
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/AuthContainer" element={<AuthContainer />} /> 
        <Route path="/Products" element={<ProductList />} /> 
        <Route path="/Cart" element={<Cart />} /> 
        <Route path="/ProductDetails/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
    </CartProvider>
  );
}

export default App;
