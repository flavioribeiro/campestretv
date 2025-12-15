const Kick = ({ videoId }) => {

    console.log("Creating YouTube component with videoId:", videoId);

    return (
        <iframe
            src={`https://player.kick.com/${videoId}?autoplay=true`}
            frameborder="0"
            scrolling="no" 
            allowfullscreen="true">
        </iframe>
    );
};

export default Kick;
