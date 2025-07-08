import { Link } from "react-router-dom";

import logo from "../assets/img/campestretv-logo.svg";

const Header = () => {
  return (
    <header className="main-header">
      <div className="container">
        <Link to="/">
          <img className="main-logo" src={logo} />
        </Link>
      </div>
    </header>
  );
};

export default Header;
