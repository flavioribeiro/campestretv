import { NavLink } from "react-router-dom";

import courts from "../assets/data/courts";

const Navigation = () => {
  return (
    <nav className="navigation">
      <ul>
        {courts.map((court) => (
          <li key={court.id}>
            <NavLink to={`/quadra/${court.id}`}>
              <img src={court.thumb} />
              <h3>Quadra {court.id}</h3>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
