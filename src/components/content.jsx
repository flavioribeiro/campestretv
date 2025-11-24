import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import courts from "../assets/data/courts";

const Content = ({ props }) => {
  const currentCourtId = props;
  let currentCourt = null;
  for (const court of courts) {
    if (court.id === currentCourtId) {
      currentCourt = court;
    }
  }

  if (!currentCourt) {
    currentCourt = courts[0];
  }

  return (
    <div className="main-content">
      <div className="container">
        <div className="player">
        <iframe 
          src={currentCourt.url}
          title="YouTube video player" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" 
          referrerpolicy="strict-origin-when-cross-origin" 
        allowfullscreen></iframe>
          <div className="court-title">
            <h1>Quadra {currentCourt.id}</h1>
            <div className="share-icon">
              <a href="#">
                <FontAwesomeIcon icon={faShareNodes} className="fa-inverse" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
