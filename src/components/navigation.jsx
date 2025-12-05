import { NavLink } from "react-router-dom";

import courts from "../assets/data/courts";

const Navigation = () => {
  const getThumbnailUrl = (court) => {
    if (court.type === "youtube") {
      return `https://i.ytimg.com/vi/${court.videoId}/maxresdefault.jpg`;
    }
    return `https://img.youtube.com/vi/pEPdLJhq6-k/maxresdefault.jpg`;
  }
  return (
    <nav className="navigation">
      <ul>
        {courts.sort((a, b) => a.id - b.id).map((court) => (
          <li key={court.id}>
            <NavLink to={`/quadra/${court.id}`}>
              <img src={getThumbnailUrl(court)} />
              <h3>Quadra {court.id}</h3>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
