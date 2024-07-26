import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';

const ProductDetails = () => {
  const { id } = useParams(); // Access route parameters
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`); // Use proxy endpoint
        console.log('Product data:', response.data); // Log the response data
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Error fetching product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="text-center text-gray-500">Product not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 mt-32">

      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-12 mb-12">
        <img
          src='/images.jpeg' // Updated path
          alt={product.name}
          className="w-full  h-auto mb-4 md:mb-0" // Adjusted dimensions
        />
        <div className="md:ml-6">
          <p className="text-lg mb-7"><strong>Category:</strong> {product.main_category}</p>
          <p className="text-lg mb-7"><strong>Price:</strong> {product.compare_price || '50Rs'}</p>
          <p className="text-lg mb-7"><strong>Description:</strong> {product.description}</p>
          <p className="text-lg mb-7"><strong>Brand:</strong> {product.brand}</p>
          <div className="flex justify-center mt-4 space-x-4  mb-7">
            <Button
              variant="contained"
              color="success"
              onClick={() => console.log('Add to Cart')}
            >
              Add to Cart
            </Button>
            <Button
              variant="outlined"
              color="success"
              onClick={() => console.log('Buy Now')}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
