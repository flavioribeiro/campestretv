import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";

import courts from "../assets/data/courts";
import ads from "../assets/img/ads-img.jpg";

const Content = ({ props }) => {
  console.log(props, courts);
  const currentCourtId = props;
  let currentCourt = null;
  for (const court of courts) {
    console.log("checking court", court.id, currentCourtId);
    if (court.id === currentCourtId) {
      console.log("found current court", court);
      currentCourt = court;
      break;
    }
  }

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
