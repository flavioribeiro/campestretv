import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";

const ShareButton = ({ url, title }) => {
  const [showPopover, setShowPopover] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const popoverRef = useRef(null);
  const buttonRef = useRef(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowPopover(false);
        setCopySuccess(false);
      }
    };

    if (showPopover) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopover]);

  const handleShare = async () => {
    // Check if native share is available
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.log("Share cancelled or failed:", error);
      }
    } else {
      setShowPopover(!showPopover);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 2_000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const shareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `${title} - ${url}`
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`;
    window.open(telegramUrl, "_blank");
  };

  return (
    <div className="share-button-container">
      <button
        ref={buttonRef}
        onClick={(event) => {
          event.preventDefault();
          handleShare();
        }}
      >
        <FontAwesomeIcon icon={faShareNodes} className="fa-inverse" />
      </button>

      {showPopover && (
        <div className="share-popover" ref={popoverRef}>
          <div className="share-popover-content">
            <button
              className="share-option"
              title="Copiar Link"
              onClick={handleCopyLink}
            >
              <FontAwesomeIcon icon={faLink} />
              <span>{copySuccess ? "Copiado!" : "Copiar Link"}</span>
            </button>
            <button
              className="share-option whatsapp"
              title="Compartilhar no WhatsApp"
              onClick={shareWhatsApp}
            >
              <FontAwesomeIcon icon={faWhatsapp} />
              <span>WhatsApp</span>
            </button>
            <button
              className="share-option telegram"
              title="Compartilhar no Telegram"
              onClick={shareTelegram}
            >
              <FontAwesomeIcon icon={faTelegram} />
              <span>Telegram</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
