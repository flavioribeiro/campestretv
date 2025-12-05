import { NavLink } from "react-router-dom";

import courts from "../assets/data/courts";

const Navigation = () => {
  return (
    <nav className="navigation">
      <ul>
        {courts.sort((a, b) => a.id - b.id).map((court) => (
          <li key={court.id}>
            <NavLink to={`/quadra/${court.id}`}>
              {court.type === "youtube" ? <img src={`https://i.ytimg.com/vi/${court.videoId}/maxresdefault.jpg`} /> : <img src={court.thumb} />}
              <h3>Quadra {court.id}</h3>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
