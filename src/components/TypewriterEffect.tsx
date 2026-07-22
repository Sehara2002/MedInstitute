"use client";
import { useEffect, useState } from "react";

interface TypewriterEffectProps {
  texts: string[];
  speed?: number;
  pause?: number;
  className?: string;
}

export function TypewriterEffect({
  texts,
  pause = 2000,
  className = "",
}: TypewriterEffectProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Fade out slightly before switching text, then fade the new one in
    const fadeOutTimer = setTimeout(() => {
      setVisible(false);
    }, pause);

    const switchTimer = setTimeout(() => {
      setIndex((i) => (i + 1) % texts.length);
      setVisible(true);
    }, pause + 400); // 400ms matches the CSS transition duration below

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(switchTimer);
    };
  }, [index, pause, texts.length]);

  return (
    <span
      className={`inline-block transition-all duration-400 ease-in-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      } ${className}`}
    >
      {texts[index]}
    </span>
  );
}