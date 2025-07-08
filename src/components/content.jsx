import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";

import courts from "../assets/data/courts";
import ads from "../assets/img/ads-img.jpg";

const Content = ({ props }) => {
  const currentCourtId = props - 1;
  const currentCourt = courts[currentCourtId];

  return (
    <div className="main-content">
      <div className="container">
        <div className="player">
          <img src={currentCourt.url} />
          <div className="court-title">
            <h1>Quadra {currentCourt.id}</h1>
            <div className="share-icon">
              <a href="#">
                <FontAwesomeIcon icon={faShareNodes} className="fa-inverse" />
              </a>
            </div>
          </div>
        </div>
        <div className="ads">
          <img src={ads} />
        </div>
      </div>
    </div>
  );
};

export default Content;
