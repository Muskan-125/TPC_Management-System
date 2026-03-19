import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGraduationCap, FaBars, FaTimes, FaHome, FaBriefcase, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUser, FaCog, FaUserShield } from 'react-icons/fa';
import { isAuthenticated, getUserRole, logout, getStoredUser } from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);
      setUserRole(getUserRole());
      setUser(getStoredUser());
    };
    checkAuth();

    // Handle scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUserRole(null);
    setUser(null);
    navigate('/');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: FaHome },
    { path: '/jobs', label: 'Jobs', icon: FaBriefcase },
  ];

  const getDashboardLink = () => {
    switch (userRole) {
      case 'ADMIN': return '/dashboard/admin';
      case 'COMPANY': return '/dashboard/company';
      case 'STUDENT': return '/dashboard/student';
      default: return '/';
    }
  };

  return (
    <motion.nav 
      className={`navbar navbar-expand-lg navbar-light bg-white fixed-top ${isScrolled ? 'shadow-lg' : 'shadow-sm'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ 
        padding: isScrolled ? '0.5rem 0' : '0.75rem 0',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="me-2"
          >
            <FaGraduationCap style={{ fontSize: '1.75rem', color: '#2563eb' }} />
          </motion.div>
          <span className="fw-bold" style={{ fontSize: '1.5rem' }}>
            <span className="gradient-text">TPC</span>
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button 
          className="navbar-toggler border-0" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ padding: '0.5rem' }}
        >
          <motion.div
            animate={{ rotate: isMenuOpen ? 90 : 0 }}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </motion.div>
        </button>

        {/* Navigation Links */}
        <AnimatePresence>
          {(isMenuOpen || window.innerWidth >= 992) && (
            <motion.div 
              className={`navbar-collapse ${isMenuOpen ? 'show' : ''} ${window.innerWidth < 992 ? 'navbar-mobile' : ''}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
                {/* Public Links */}
                {navLinks.map((link) => (
                  <li className="nav-item" key={link.path}>
                    <Link 
                      className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="d-flex align-items-center gap-2"
                      >
                        <link.icon className="d-lg-none" />
                        {link.label}
                      </motion.div>
                    </Link>
                  </li>
                ))}

                {/* Auth Links */}
                {isLoggedIn ? (
                  <>
                    <li className="nav-item">
                      <Link 
                        className={`nav-link ${location.pathname.includes('/dashboard') ? 'active' : ''}`}
                        to={getDashboardLink()}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="d-flex align-items-center gap-2"
                        >
                          <FaUser className="d-lg-none" />
                          Dashboard
                        </motion.div>
                      </Link>
                    </li>
                    <li className="nav-item ms-lg-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <button 
                          className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2"
                          onClick={handleLogout}
                        >
                          <FaSignOutAlt />
                          <span className="d-none d-lg-inline">Logout</span>
                        </button>
                      </motion.div>
                    </li>
                    {user && (
                      <li className="nav-item ms-lg-2 d-none d-lg-block">
                        <div className="d-flex align-items-center gap-2">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                            style={{ 
                              width: '38px', 
                              height: '38px', 
                              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                              fontSize: '0.9rem'
                            }}
                          >
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        </div>
                      </li>
                    )}
                  </>
                ) : (
                  <>
                    <li className="nav-item ms-lg-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link 
                          to="/login" 
                          className="btn btn-outline-primary"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FaSignInAlt className="me-2" />
                          Login
                        </Link>
                      </motion.div>
                    </li>
                    <li className="nav-item ms-lg-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link 
                          to="/register" 
                          className="btn btn-primary"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FaUserPlus className="me-2" />
                          Register
                        </Link>
                      </motion.div>
                    </li>
                  </>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu Styles */}
      <style>{`
        @media (max-width: 991px) {
          .navbar-mobile {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            padding: 1rem;
            z-index: 1000;
          }
          .navbar-nav {
            padding-top: 1rem;
          }
          .nav-link {
            padding: 0.75rem 1rem !important;
            border-radius: 8px;
            margin-bottom: 0.25rem;
          }
          .nav-link:hover, .nav-link.active {
            background: rgba(37, 99, 235, 0.1);
            color: #2563eb !important;
          }
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;

