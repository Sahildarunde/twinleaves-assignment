import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchFilter from './SearchFilter';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress, Button, Select, MenuItem, Typography } from '@mui/material';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Select a category']); 
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); 
  const [sortOrder, setSortOrder] = useState('asc'); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        const products = response.data.products;

        const categorySet = new Set();
        products.forEach(product => {
          if (product.category_level_1) {
            categorySet.add(product.category_level_1);
          }
        });

        const uniqueCategories = Array.from(categorySet);
        setCategories(['Select a category', ...uniqueCategories]); 
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/products', {
          params: {
            searchTerm,
            category: selectedCategory === 'Select a category' ? '' : selectedCategory, 
            page: page + 1, 
            pageSize,
            sortOrder 
          }
        });
        const fetchedProducts = response.data.products.map((product, index) => ({
          ...product,
          id: product.id || index, 
        }));
        setProducts(fetchedProducts);
        setTotalProducts(response.data.total); 
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, selectedCategory, page, pageSize, sortOrder]);

  const handleRowClick = (params) => {
    navigate(`/product/${params.row.id}`);
  };

  const columns = [
    {
      field: 'product',
      headerName: 'Product',
      width: 600,
      renderCell: (params) => (
        <div className="flex flex-col items-start p-4">
          <img
            src={params.row.image ? params.row.image : '/images.jpeg'}
            alt={params.row?.name || 'Product Image'}
            className="h-24 w-auto mb-2"
          />
          <Typography variant="h6" className="mb-2">
            {params.row.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" className="mb-2">
            Category: {params.row.category_level_1}
          </Typography>
          <Typography variant="body2" color="textSecondary" className="mb-2">
            Price: ₹{params.row.price || '500.00'}
          </Typography>
          <div className="flex justify-center mt-2 space-x-2">
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={(e) => {
                e.stopPropagation(); 
              }}
            >
              Add to Cart
            </Button>
            <Button
              variant="outlined"
              color="success"
              size="small"
              onClick={(e) => {
                e.stopPropagation(); 
              }}
            >
              Buy Now
            </Button>
          </div>
        </div>
      ),
    }
  ];

  return (
    <div className="p-4 flex flex-col">
      <SearchFilter setSearchTerm={setSearchTerm} />
      <div className="my-4 flex flex-col sm:flex-row sm:items-center justify-center">
        <Select
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory === '' ?  "Select category" : selectedCategory}
          variant="outlined"
          className="mb-4 sm:mb-0 sm:mr-4"
        >
          {categories.map((category, index) => (
            <MenuItem key={index} value={category} aria-placeholder='select category'>{category}</MenuItem>
          ))}
        </Select>
        <Select
          onChange={(e) => setSortOrder(e.target.value)}
          value={sortOrder}
          variant="outlined"
        >
          <MenuItem value="asc">Price: Low to High</MenuItem>
          <MenuItem value="desc">Price: High to Low</MenuItem>
        </Select>
      </div>
      <div className="w-full flex justify-center items-center">
        <div className="w-1/2">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <CircularProgress />
            </div>
          ) : (
            <DataGrid
              rows={products}
              columns={columns}
              pageSize={pageSize}
              rowHeight={270}
              rowsPerPageOptions={[6]}
              pagination
              onPageChange={(newPage) => setPage(newPage)}
              onPageSizeChange={(newPageSize) => {
                setPageSize(newPageSize);
                setPage(0); 
              }}
              rowCount={totalProducts}
              loading={loading}
              onRowClick={handleRowClick}
              components={{
                NoRowsOverlay: () => <div className="text-center">No products available.</div>
              }}
              className="bg-white"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
