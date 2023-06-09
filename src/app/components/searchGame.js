
import React, { useState } from 'react';
import { BsSearch } from 'react-icons/bs';

const SearchGameBar = ({ onSearch }) => {

    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = event => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    return (
        <div className='flex mx-auto justify-end mt-3 mb-0 me-4'>
            <input placeholder='Search for a game' className='border border-solid border-neutral-400 rounded-md p-1' type='text' value={searchTerm} onChange={handleInputChange} />
            <button onClick={handleSearch} className='bg-sky-400 p-2 rounded-md ml-1'>
                <span ><BsSearch /></span>
            </button>
        </div>
    );
};

export default SearchGameBar;