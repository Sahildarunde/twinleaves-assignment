import React from 'react';
import { BrowserRouter as Router, Route , Routes, BrowserRouter} from 'react-router-dom';
import ProductTable from './components/ProductTable';
import ProductDetails from './pages/ProductDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        hi there i am sahil

        <Route exact path="/" element={<ProductTable/>} />
        <Route path="/product/:id" element={<ProductDetails/>} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
