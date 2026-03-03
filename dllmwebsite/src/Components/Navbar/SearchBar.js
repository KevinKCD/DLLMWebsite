import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSearch } from 'react-icons/bi';

function SearchBar() {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery('');
      setExpanded(false);
    }
  };

  return (
    <form
      className={`navbar-search-form ${expanded ? 'expanded' : ''}`}
      onSubmit={handleSubmit}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => !query && setExpanded(false)}
      />
      <button
        type="button"
        className="search-icon-btn"
        onClick={() => setExpanded(true)}
      >
        <BiSearch size={20} color="#fff" />
      </button>
    </form>
  );
}

export default SearchBar;
