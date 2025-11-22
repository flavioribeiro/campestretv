import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { Player } from "../components/player";
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

  const playerRef = {};

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: currentCourt.url
    }]
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };


  return (
    <div className="main-content">
      <div className="container">
        <div className="player">
          <Player options={videoJsOptions} onReady={handlePlayerReady} />
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
