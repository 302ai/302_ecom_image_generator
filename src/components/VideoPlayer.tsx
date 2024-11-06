import React from "react";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  url: string;
  width?: string;
  height?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  width = "100%",
  height = "100%",
}) => {
  return (
    <ReactPlayer
      url={url}
      width={width}
      height={height}
      controls={true}
      config={{
        youtube: {
          playerVars: { showinfo: 1 },
        },
      }}
    />
  );
};

export default VideoPlayer;