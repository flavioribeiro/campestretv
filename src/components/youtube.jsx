const YouTube = ({ videoId }) => {

    console.log("Creating YouTube component with videoId:", videoId);

    return (
        <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen>
        </iframe>
    );
};

export default YouTube;
