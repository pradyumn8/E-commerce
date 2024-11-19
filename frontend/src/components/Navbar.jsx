import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
  }
  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="Logo" />
      </Link>

      {/* Navigation Links */}
      <ul className='sm:flex gap-5 text-sm text-gray-700 hidden'>
        
        <NavLink to='/' className="flex flex-col items-center gap-1">
            <p>HOME</p>
            <hr  className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>
        
        <NavLink to='/collection' className="flex flex-col items-center gap-1">
            <p>COLLECTION</p>
            <hr  className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>
        
        <NavLink to='/about' className="flex flex-col items-center gap-1">
            <p>ABOUT</p>
            <hr  className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>
        
        <NavLink to='/contact' className="flex flex-col items-center gap-1">
            <p>CONTACT</p>
            <hr  className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>
        </ul>


      {/* Icons */}
      <div className="flex items-center gap-6">
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt="Search"
          aria-label="Search"
        />

        {/* Profile Dropdown */}
        <div className="relative">
          <img
            onClick={() => setDropdownVisible(!dropdownVisible)}
            src={assets.profile_icon}
            className="w-5 cursor-pointer"
            alt="Profile"
          />
          {dropdownVisible && (
            <div className="absolute dropdown-menu right-0 pt-4 flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-center">
              <p className="cursor-pointer hover:text-black">My Profile</p>
              <p className="cursor-pointer hover:text-black">Orders</p>
              <p onClick={logout} className="cursor-pointer hover:text-black">Logout</p>
            </div>
          )}
        </div>

        {/* Cart Icon */}
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount() || 0}
          </p>
        </Link>

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="Menu"
          aria-label="Open menu"
        />
      </div>

      {/* Sidebar Menu for Small Screens */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? 'w-full' : 'w-0'
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="Close menu" />
            <p>Back</p>
          </div>
          {['Home', 'Collection', 'About', 'Contact'].map((text) => (
            <NavLink
              key={text}
              onClick={() => setVisible(false)}
              className="py-2 pl-6 border"
              to={`/${text.toLowerCase()}`}
            >
              {text.toUpperCase()}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
