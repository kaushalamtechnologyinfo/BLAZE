"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

export default function HeroVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const el = ref.current;
    return () => {
      if (el) {
        el.pause();
        el.removeAttribute("src");
        el.load();
      }
    };
  }, []);

  function toggleMute() {
    if (!ref.current) return;
    ref.current.muted = !ref.current.muted;
    setMuted(ref.current.muted);
  }

  function togglePlay() {
    if (!ref.current) return;
    if (ref.current.paused) {
      ref.current.play();
      setPlaying(true);
    } else {
      ref.current.pause();
      setPlaying(false);
    }
  }

  return (
    <>
      <video
        ref={ref}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Directional cinematic vignette so text on left stays crisp while video shines */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/55 to-navy-950/20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-navy-950/30" />

      <div className="absolute right-5 bottom-5 z-20 flex items-center gap-2 sm:right-8 sm:bottom-8">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause video" : "Play video"}
          className="grid h-10 w-10 place-items-center rounded-full bg-navy-950/70 text-white ring-1 ring-white/25 backdrop-blur-md transition hover:bg-brand-500 hover:ring-brand-400"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="grid h-10 w-10 place-items-center rounded-full bg-navy-950/70 text-white ring-1 ring-white/25 backdrop-blur-md transition hover:bg-brand-500 hover:ring-brand-400"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </>
  );
}
