"use client";

import { useEffect, useState } from "react";

interface TypewriterEffectProps {
    texts: string[];
    speed?: number;
    pause?: number;
    className?: string;
    cursorClassName?: string;
}

export function TypewriterEffect({
    texts,
    speed = 50,
    pause = 1500,
    className = "",
    cursorClassName = "",
}: {
    texts: string[];
    speed?: number;
    pause?: number;
    className?: string;
    cursorClassName?: string;
}) {
    const [displayedText, setDisplayedText] = useState("");
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentFullText = texts[currentTextIndex];

        const handleTyping = () => {
            setDisplayedText((prev) => {
                if (isDeleting) {
                    return currentFullText.substring(0, prev.length - 1);
                } else {
                    return currentFullText.substring(0, prev.length + 1);
                }
            });

            if (!isDeleting && displayedText === currentFullText) {
                setTimeout(() => setIsDeleting(true), pause);
            } else if (isDeleting && displayedText === "") {
                setIsDeleting(false);
                setCurrentTextIndex((prev) => (prev + 1) % texts.length);
            }
        };

        const timer = setTimeout(handleTyping, isDeleting ? speed / 2 : speed);

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, currentTextIndex, texts, speed, pause]);

    return (
        <span className={className}>
            {displayedText}
            <span className={`inline-block w-[2px] h-[1em] bg-current align-middle ml-1 animate-pulse ${cursorClassName}`} />
        </span>
    );
}
