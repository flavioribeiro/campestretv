import courts from "../assets/data/courts";
import ShareButton from "./ShareButton";

const Content = ({ props }) => {
  const currentCourtId = props;

  // set default court if no court is provided
  let currentCourt = courts[0];

  for (const court of courts) {
    if (court.id === currentCourtId) {
      currentCourt = court;
    }
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
              <ShareButton
                url={`${window.location.origin}/quadra/${currentCourt.id}`}
                title={`Quadra ${currentCourt.id} - Campestre TV`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
