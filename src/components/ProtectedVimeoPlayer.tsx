"use client";
import { useEffect, useRef, useState } from "react";
import Player from "@vimeo/player";
import { Play, Pause, RotateCcw, RotateCw, Maximize, Minimize } from "lucide-react";

interface Props {
  vimeoId: string;
  studentEmail: string;
  onFirstPlay?: () => void;
}

export function ProtectedVimeoPlayer({ vimeoId, studentEmail, onFirstPlay }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const hasFiredFirstPlay = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", blockContextMenu);
    return () => document.removeEventListener("contextmenu", blockContextMenu);
  }, []);

  useEffect(() => {
    if (!iframeContainerRef.current) return;

    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    hasFiredFirstPlay.current = false;

    const player = new Player(iframeContainerRef.current, {
      id: Number(vimeoId),
      controls: false,
      title: false,
      byline: false,
      portrait: false,
      dnt: true,
      responsive: true,
    });

    playerRef.current = player;
    setIsPlaying(false);
    setProgress(0);

    player.on("play", () => {
      setIsPlaying(true);
      if (!hasFiredFirstPlay.current) {
        hasFiredFirstPlay.current = true;
        onFirstPlay?.();
      }
    });
    player.on("pause", () => setIsPlaying(false));
    player.on("timeupdate", (data) => setProgress(data.seconds));
    player.getDuration().then((d) => setDuration(d));

    return () => {
      player.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vimeoId]);

  useEffect(() => {
    function handleFsChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  function togglePlay() {
    if (!playerRef.current) return;
    isPlaying ? playerRef.current.pause() : playerRef.current.play();
  }

  function skip(seconds: number) {
    if (!playerRef.current) return;
    playerRef.current.getCurrentTime().then((current) => {
      playerRef.current?.setCurrentTime(Math.max(0, current + seconds));
    });
  }

  function seekTo(e: React.MouseEvent<HTMLDivElement>) {
    if (!playerRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    playerRef.current.setCurrentTime(ratio * duration);
  }

  function toggleFullscreen() {
    if (!wrapperRef.current) return;
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full bg-black overflow-hidden select-none ${
        isFullscreen ? "h-full flex items-center justify-center" : "aspect-video rounded-xl"
      }`}
      onCopy={(e) => e.preventDefault()}
    >
      <div ref={iframeContainerRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      <div className="absolute top-2 right-3 text-[10px] text-white/40 pointer-events-none select-none font-mono z-10">
        {studentEmail}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-3">
        <div className="h-1.5 w-full bg-white/25 rounded-full cursor-pointer mb-3" onClick={seekTo}>
          <div
            className="h-full bg-medical-green-500 rounded-full"
            style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
          />
        </div>
        <div className="flex items-center justify-center gap-6">
          <button onClick={() => skip(-10)} className="text-white hover:text-medical-green-400 transition-colors">
            <RotateCcw className="h-6 w-6" />
          </button>
          <button onClick={togglePlay} className="text-white hover:text-medical-green-400 transition-colors">
            {isPlaying ? <Pause className="h-9 w-9" /> : <Play className="h-9 w-9" />}
          </button>
          <button onClick={() => skip(10)} className="text-white hover:text-medical-green-400 transition-colors">
            <RotateCw className="h-6 w-6" />
          </button>
          <span className="text-white/80 text-xs font-mono ml-2">
            {formatTime(progress)} / {formatTime(duration)}
          </span>
          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-medical-green-400 transition-colors ml-auto"
          >
            {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </div>
  );
}