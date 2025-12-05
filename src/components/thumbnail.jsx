import { useState, useEffect } from "react";
import NoThumbnail from "../assets/img/no-thumb.png";

const CourtThumbnail = ({ court }) => {
  const getThumbnailUrl = () => {
    const timestamp = Date.now();
    return NoThumbnail;
    if (court.type === "youtube") {
      return `https://i.ytimg.com/vi/${court.videoId}/maxresdefault.jpg?t=${timestamp}`;
    }
    return NoThumbnail;
  };

  const [imageSrc, setImageSrc] = useState(getThumbnailUrl);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageSrc(getThumbnailUrl());
    }, 30000);

    return () => clearInterval(interval);
  }, [court.videoId, court.type]);

  return <img src={imageSrc} alt={`Quadra ${court.id}`} />;
};

export default CourtThumbnail;