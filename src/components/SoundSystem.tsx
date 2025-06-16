"use client";

import { useEffect, useRef } from "react";

interface SoundSystemProps {
  enabled?: boolean;
  volume?: number;
}

const sounds = {
  click: "/sounds/click.mp3",
  hover: "/sounds/hover.mp3",
  success: "/sounds/success.mp3",
  error: "/sounds/error.mp3",
  whoosh: "/sounds/whoosh.mp3",
  chime: "/sounds/chime.mp3",
};

export default function SoundSystem({
  enabled = true,
  volume = 0.2,
}: SoundSystemProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundBuffersRef = useRef<{ [key: string]: AudioBuffer }>({});

  useEffect(() => {
    if (!enabled) return;

    // Initialize Web Audio API
    const initAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();

        // Load sound files
        for (const [name, url] of Object.entries(sounds)) {
          try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer =
              await audioContextRef.current!.decodeAudioData(arrayBuffer);
            soundBuffersRef.current[name] = audioBuffer;
          } catch (error) {
            console.warn(`Failed to load sound: ${name}`);
          }
        }
      } catch (error) {
        console.warn("Web Audio API not supported");
      }
    };

    initAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [enabled]);

  const playSound = (soundName: keyof typeof sounds) => {
    if (
      !enabled ||
      !audioContextRef.current ||
      !soundBuffersRef.current[soundName]
    )
      return;

    try {
      const source = audioContextRef.current.createBufferSource();
      const gainNode = audioContextRef.current.createGain();

      source.buffer = soundBuffersRef.current[soundName];
      gainNode.gain.value = volume;

      source.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      source.start();
    } catch (error) {
      console.warn("Failed to play sound:", soundName);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    // Add event listeners for UI interactions
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON" || target.closest("button")) {
        playSound("click");
      }
    };

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.tagName === "A" ||
        target.closest("a")
      ) {
        playSound("hover");
      }
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("mouseenter", handleMouseEnter, true);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("mouseenter", handleMouseEnter, true);
    };
  }, [enabled, volume]);

  // Expose playSound function globally
  useEffect(() => {
    (window as any).playSound = playSound;
  }, []);

  return null;
}

// Hook for using sounds in components
export const useSound = () => {
  return {
    playClick: () => (window as any).playSound?.("click"),
    playHover: () => (window as any).playSound?.("hover"),
    playSuccess: () => (window as any).playSound?.("success"),
    playError: () => (window as any).playSound?.("error"),
    playWhoosh: () => (window as any).playSound?.("whoosh"),
    playChime: () => (window as any).playSound?.("chime"),
  };
};
