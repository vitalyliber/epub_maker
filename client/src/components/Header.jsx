import React from "react";

function Header() {
  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand" href="#">
          Epub Maker
        </a>
        <a
          href="https://github.com/vitalyliber/epub_maker"
          className="nav-link"
          target="_blank"
        >
          GitHub
        </a>
      </div>
    </nav>
  );
}

export default Header;
