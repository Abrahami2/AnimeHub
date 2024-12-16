import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import animeLogo from '../anime.png';

// INTERNAL IMPORTS
import "./Navbar.modules.css";

function NavBar({ userstate, setSearchTerm, searchTerm }) {
  const [click, setClick] = useState(false);
  const location = useLocation();

  const handleClick = () => setClick(!click);

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
        <NavLink exact to="/" className="nav-logo">
  <img src={animeLogo} alt="Anime Hub Logo" className="icon" />
  Anime Hub
</NavLink>


          {location.pathname === "/" && ( // Render search bar only on home page
            <div className="searchContainer">
              <input
                className="searchInput"
                type="text"
                placeholder="Search posts by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <NavLink
                exact
                to="/"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/create-post"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Create Post
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
