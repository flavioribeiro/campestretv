import { useState, useEffect, useCallback } from "react";
import NoThumbnail from "../assets/img/no-thumb.png";

const CourtThumbnail = ({ court }) => {
  const getThumbnailUrl = useCallback(() => {
    const timestamp = Date.now();
    if (court.type === "youtube") {
      return `https://i.ytimg.com/vi/${court.videoId}/maxresdefault.jpg?t=${timestamp}`;
    }
    return NoThumbnail;
  }, [court.videoId, court.type]);

  const [imageSrc, setImageSrc] = useState(() => getThumbnailUrl());

  useEffect(() => {
    setImageSrc(getThumbnailUrl());

    const interval = setInterval(() => {
      setImageSrc(getThumbnailUrl());
    }, 30000);

    return () => clearInterval(interval);
  }, [getThumbnailUrl]);

  return <img src={imageSrc} alt={`Quadra ${court.id}`} />;
};

export default CourtThumbnail;
