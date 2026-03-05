import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Header.css';
import logo from '../../assets/images/Logo.jpg';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../Buttons/Buttons.css';

interface NavItem {
  name: string;
  path: string;
}

const navItems: NavItem[] = [
  { name: 'Videos', path: '/videos' },
  { name: 'Members', path: '/members' },
  { name: 'Events', path: '/events' },
];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  const toggleSearch = () => {
    setSearchOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar navbar-expand-lg bg-white shadow-sm fixed top">
      <div className="container-fluid d-flex align-items-center">
        {/* LEFT */}
        <div className="navbar-section navbar-left">
          <a
            href="/"
            className="navbar-brand d-flex align-items-center permanent-marker-regular"
          >
            <img src={logo} alt="DLLM Logo" className="logo-img me-2" />
            DLLM Sporting
          </a>
        </div>

        {/* CENTER */}
        <div className="navbar-section navbar-center">
          <ul className="navbar-nav d-flex flex-row">
            {navItems.map(({ name, path }) => (
              <li key={name} className="nav-item">
                <button
                  className="nav-link btn btn-link d-flex align-items-center px-5 py-2"
                  onClick={() => navigate(path)}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT */}
        <div className="navbar-section navbar-right">
          <div className="d-flex align-items-center">
            <div className="navbar-search-container me-3" ref={searchRef}>
              <div className={`navbar-search ${searchOpen ? 'open' : ''}`}>
                <i
                  className="bi bi-search search-icon"
                  onClick={toggleSearch}
                />
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Search..."
                  autoFocus={searchOpen}
                />
              </div>
            </div>

            {user ? (
              <div className="d-flex align-items-center navbar-auth">
                <Link
                  to={`/profile/${user.uid}`}
                  className="d-flex align-items-center text-decoration-none profile-link"
                >
                  <img
                    src={user.avatar ?? '/default-avatar.png'}
                    alt="avatar"
                    className="navbar-avatar"
                  />
                  <strong className="navbar-username">{user.name}</strong>
                </Link>

                <button
                  className="btn-base btn-sm btn-primary-blue ms-3"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center navbar-auth gap-2">
                <button
                  className="btn-base btn-sm btn-primary-blue"
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
                <button
                  className="btn-base btn-sm btn-primary-blue"
                  onClick={() => navigate('/signup')}
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
