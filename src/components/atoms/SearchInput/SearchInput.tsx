import React from 'react';
import './searchInput.css';

interface SearchInputProps {
  query: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeHolder: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  query,
  handleChange,
  placeHolder,
}) => {
  return (
    <div className='text-input-container'>
      <input
        className='text-input'
        name='search'
        value={query}
        onChange={handleChange}
        placeholder={placeHolder ? placeHolder : ''}
        type='text'
      />
    </div>
  );
};

export default SearchInput;
