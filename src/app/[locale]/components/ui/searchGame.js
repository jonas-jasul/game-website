
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { BsSearch } from 'react-icons/bs';

const SearchGameBar = ({ searchParams, onSearch }) => {
    const t = useTranslations('FilterBar');
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    const pathname = usePathname();
    const handleInputChange = event => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        if (searchTerm != '') {
            onSearch(searchTerm);
            const url = new URLSearchParams(searchParams);
            url.set("search", searchTerm);
            url.set("page", 1);
            const urlStr = url.toString();
            router.push(`${pathname}?${urlStr}`);
        }
    };

    return (
        <div className='flex mx-auto justify-end mt-3 mb-0 me-4'>
            <input placeholder={t('searchGamePlaceholder')} className='input input-bordered max-w-lg' type='text' value={searchTerm} onChange={handleInputChange} />
            <button onClick={handleSearch} className='btn bg-base-300 hover:bg-info p-2 rounded-md ml-1'>
                <span ><BsSearch /></span>
            </button>
        </div>
    );
};

export default SearchGameBar;