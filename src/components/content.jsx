import courts from "../assets/data/courts";
import ShareButton from "./ShareButton";
import YouTube from "./youtube";
import Clappr from "./clappr";

const Content = ({ props }) => {
  const currentCourtId = props;

  // set default court if no court is provided
  let currentCourt = courts[0];

  for (const court of courts) {
    if (court.id === currentCourtId) {
      currentCourt = court;
      break;
    }
  }

  return (
    <div className="main-content">
      <div className="container">
        <div className="player">
          { currentCourt.type === "youtube" ? (
            <YouTube videoId={currentCourt.videoId} />
          ) : (
            <Clappr url={currentCourt.url} />
          )}
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
