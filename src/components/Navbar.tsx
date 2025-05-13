import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/podcast', label: 'Podcast' },
    { path: '/book', label: 'Book' },
    { path: '/speaking', label: 'Speaking' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ease-in-out ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="flex items-center space-x-2">
              <img src="/logo.png" alt="THESCIENCEOFPUBLICRELATIONS Logo" className="h-10 w-10" />
              <span className="text-lg font-bold text-gray-900">THE SCIENCE OF PUBLIC RELATIONS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-gray-800 hover:text-yellow-500 transition duration-300 ${
                  location.pathname === item.path ? 'text-yellow-500' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex">
            <Link
              to="/book"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 shadow-md"
            >
              Pre-order Book
            </Link>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 hover:text-yellow-500 focus:outline-none"
            >
              {isOpen ?
                <X className="h-6 w-6" /> :
                <Menu className="h-6 w-6" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded-md text-gray-800 hover:bg-yellow-50 hover:text-yellow-500 ${
                location.pathname === item.path ? 'bg-yellow-50 text-yellow-500' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-4 px-3">
            <Link
              to="/book"
              className="block w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 shadow-md text-center"
              onClick={() => setIsOpen(false)}
            >
              Pre-order Book
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;