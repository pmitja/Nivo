"use client";

import { useRef } from "react";

export function PromoVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const keepMuted = () => {
    const video = videoRef.current;
    if (video) video.muted = true;
  };

  return (
    <>
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        playsInline
        muted
        preload="metadata"
        poster="/home/obrtio-demo-still.webp"
        controls={false}
        onVolumeChange={keepMuted}
        autoPlay
        loop
      >
        <source src="/video/promo-video.mp4" type="video/mp4" />
      </video>
    </>
  );
}
