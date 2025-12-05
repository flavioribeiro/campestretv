import { useEffect, useState } from 'react';
import { Player } from "@clappr/core";
import { MediaControl } from '@clappr/plugins';

const Clappr = ({ url }) => {

    const [player, setPlayer] = useState(null);

    useEffect(() => {
        if (!player && url) {
            setPlayer(new Player({
                    source: url,
                    autoPlay: true,
                    mute: true,
                    height: "100%",
                    width: "100%",  
                    parentId: ".clappr-player",
                    plugins: [
                        MediaControl
                    ],
                    mediacontrol: {seekbar: "#4bd573", buttons: "#FFFFFF"}
            }));
        }
    }, player);

    return (
        <div className="clappr-player"></div>
    );
};

export default Clappr;