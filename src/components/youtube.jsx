const YouTube = ({ videoId }) => {

    console.log("Creating YouTube component with videoId:", videoId);

    return (
        <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen>
        </iframe>
    );
};

export default YouTube;
