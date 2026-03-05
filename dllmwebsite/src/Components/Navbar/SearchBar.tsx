import React, {
  useState,
  useRef,
  useEffect,
  FormEvent,
  ChangeEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSearch as BiSearchIcon } from 'react-icons/bi';

const SearchBar: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const SearchIcon = BiSearchIcon as React.ElementType;

  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery('');
      setExpanded(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
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
        onChange={handleChange}
        onBlur={() => !query && setExpanded(false)}
      />
      <button
        type="button"
        className="search-icon-btn"
        onClick={() => setExpanded(true)}
      >
        <SearchIcon size={20} color="#fff" />
      </button>
    </form>
  );
};

export default SearchBar;
