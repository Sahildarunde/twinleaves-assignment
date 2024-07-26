import React from 'react';
import TextField from '@mui/material/TextField';

const SearchFilter = ({ setSearchTerm }) => {
  const handleSearchChange = (e) => {
    const value = e.target.value;
    console.log('Search Term:', value); 
    setSearchTerm(value);
  };

  return (
    <div className="flex justify-center mb-5">
      <div className="w-1/2">
        <TextField
          label="Search Products"
          variant="outlined"
          onChange={handleSearchChange}
          fullWidth 
        />
      </div>
    </div>
  );
};

export default SearchFilter;
