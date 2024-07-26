const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 5000;


app.use(cors())




// app.get('/api/products', async (req, res) => {
//   try {
//     const { category, searchTerm } = req.query;
//     const response = await axios.get('https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app/cms/products');
//     let products = response.data.products;

//     // Filter by category if provided
//     if (category) {
//       products = products.filter(product => product.category_level_1 === category);
//     }

//     // Filter by searchTerm if provided
//     if (searchTerm) {
//       products = products.filter(product =>
//         product.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     res.json({ products });
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).send('Error fetching products');
//   }
// });



// app.get('/api/products', async (req, res) => {
//   try {
//     const { category, searchTerm, page = 1, pageSize = 6 } = req.query;
//     const response = await axios.get('https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app/cms/products');
//     let products = response.data.products;

//     // Convert page and pageSize to numbers
//     const currentPage = parseInt(page, 10);
//     const currentPageSize = parseInt(pageSize, 10);

//     // Filter by category if provided
//     if (category) {
//       products = products.filter(product => product.category_level_1 === category);
//     }

//     // Filter by searchTerm if provided
//     if (searchTerm) {
//       products = products.filter(product =>
//         product.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Calculate pagination details
//     const totalProducts = products.length;
//     const startIndex = (currentPage - 1) * currentPageSize;
//     const endIndex = startIndex + currentPageSize;
//     const paginatedProducts = products.slice(startIndex, endIndex);

//     res.json({ products: paginatedProducts, total: totalProducts });
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).send('Error fetching products');
//   }
// });


app.get('/api/products', async (req, res) => {
  try {
    const { category, searchTerm, page = 1, pageSize = 10, sortOrder = 'asc' } = req.query;
    const response = await axios.get('https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app/cms/products');
    let products = response.data.products;

    // Filter by category if provided
    if (category) {
      products = products.filter(product => product.category_level_1 === category);
    }

    // Filter by searchTerm if provided
    if (searchTerm) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products by price
    products.sort((a, b) => {
      if (sortOrder === 'asc') {
        return (a.mrp.mrp || 0) - (b.mrp.mrp || 0);
      } else {
        return (b.mrp.mrp || 0) - (a.mrp.mrp || 0);
      }
    });

    // Implement pagination
    const startIndex = (page - 1) * pageSize;
    const paginatedProducts = products.slice(startIndex, startIndex + pageSize);

    res.json({
      products: paginatedProducts,
      total: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});




app.get('/api/products/:index', async (req, res) => {
  try {
      const { index } = req.params;
      const idx = parseInt(index, 10);  // Convert the index parameter to an integer
      const response = await axios.get('https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app/cms/products');
      const products = response.data.products;

      if (idx >= 0 && idx < products.length) {
          const product = products[idx];
          res.json(product);
      } else {
          res.status(404).send('Product not found');
      }
  } catch (error) {
      console.error('Error fetching product details:', error);
      res.status(500).send('Error fetching product details');
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
