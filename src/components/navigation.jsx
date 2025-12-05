import { NavLink } from "react-router-dom";

import live from "../assets/data/live.json";
import CourtThumbnail from "./thumbnail";

const Navigation = () => {
  return (
    <nav className="navigation">
      <ul>
        {live.sort((a, b) => a.id - b.id).map((court) => (
          <li key={court.id}>
            <NavLink to={`/quadra/${court.id}`}>
              <CourtThumbnail court={court} />
              <h3>Quadra {court.id}</h3>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
