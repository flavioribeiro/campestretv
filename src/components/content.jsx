import live from "../assets/data/live.json";
import ShareButton from "./ShareButton";
import YouTube from "./youtube";
import Clappr from "./clappr";

const Content = ({ props }) => {
  const currentCourtId = props;

  // set default court if no court is provided
  let currentCourt = live[0];

  for (const court of live) {
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
            <h1>{currentCourt.title}</h1>
            <div className="share-icon">
              <ShareButton
                url={`${window.location.origin}/live/${currentCourt.id}`}
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
