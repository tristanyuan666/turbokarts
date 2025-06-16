"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
  isClicking: boolean;
  cursorType: "default" | "hover" | "text" | "button" | "drag";
}

interface TrailPoint {
  x: number;
  y: number;
  id: number;
  timestamp: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export default function RevolutionaryCursor() {
  const [cursorState, setCursorState] = useState<CursorState>({
    x: 0,
    y: 0,
    isHovering: false,
    isClicking: false,
    cursorType: "default",
  });

  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const trailIdRef = useRef(0);
  const particleIdRef = useRef(0);
  const animationFrameRef = useRef<number>();

  // Create particles on click
  const createParticles = useCallback((x: number, y: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const velocity = 2 + Math.random() * 3;
      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 60,
        maxLife: 60,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  }, []);

  // Mouse move handler
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      setCursorState((prev) => ({ ...prev, x, y }));
      cursorX.set(x);
      cursorY.set(y);

      // Add to trail
      setTrail((prev) => {
        const newTrail = [
          ...prev,
          {
            x,
            y,
            id: trailIdRef.current++,
            timestamp: Date.now(),
          },
        ];
        return newTrail.slice(-8); // Keep last 8 points for better performance
      });

      // Determine cursor type based on element
      const target = e.target as HTMLElement;
      let newCursorType: CursorState["cursorType"] = "default";

      if (
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer")
      ) {
        newCursorType = "button";
      } else if (target.tagName === "A" || target.closest("a")) {
        newCursorType = "hover";
      } else if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true"
      ) {
        newCursorType = "text";
      } else if (
        target.classList.contains("draggable") ||
        target.closest(".draggable")
      ) {
        newCursorType = "drag";
      }

      setCursorState((prev) => ({ ...prev, cursorType: newCursorType }));
      setIsVisible(true);
    },
    [cursorX, cursorY],
  );

  // Mouse enter/leave handlers
  const handleMouseEnter = useCallback(() => {
    setCursorState((prev) => ({ ...prev, isHovering: true }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCursorState((prev) => ({ ...prev, isHovering: false }));
    setIsVisible(false);
  }, []);

  // Mouse down/up handlers
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      setCursorState((prev) => ({ ...prev, isClicking: true }));
      createParticles(e.clientX, e.clientY);

      // Haptic feedback on mobile
      if ("vibrate" in navigator) {
        navigator.vibrate(50);
      }
    },
    [createParticles],
  );

  const handleMouseUp = useCallback(() => {
    setCursorState((prev) => ({ ...prev, isClicking: false }));
  }, []);

  // Animation loop for particles and trail cleanup
  const animate = useCallback(() => {
    // Update particles
    setParticles((prev) =>
      prev
        .map((particle) => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vx: particle.vx * 0.98,
          vy: particle.vy * 0.98,
          life: particle.life - 1,
        }))
        .filter((particle) => particle.life > 0),
    );

    // Clean old trail points
    const now = Date.now();
    setTrail((prev) => prev.filter((point) => now - point.timestamp < 500));

    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
    animate,
  ]);

  if (!isVisible) return null;

  return (
    <>
      {/* Main Cursor */}
      <motion.div
        className={`custom-cursor ${
          cursorState.isHovering ? "cursor-hover" : ""
        } ${cursorState.isClicking ? "cursor-click" : ""} ${
          cursorState.cursorType === "text" ? "cursor-text" : ""
        }`}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <div className="cursor-core" />
        <div className="cursor-ring" />

        {/* Contextual cursor elements */}
        {cursorState.cursorType === "button" && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </motion.div>
        )}

        {cursorState.cursorType === "drag" && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-6 h-6 border-2 border-white rounded-full border-dashed" />
          </motion.div>
        )}
      </motion.div>

      {/* Trail */}
      {trail.map((point, index) => {
        const opacity = ((index + 1) / trail.length) * 0.6;
        const scale = ((index + 1) / trail.length) * 0.8;
        return (
          <motion.div
            key={point.id}
            className="fixed pointer-events-none z-[9998]"
            style={{
              left: point.x - 2,
              top: point.y - 2,
              opacity,
              transform: `scale(${scale})`,
            }}
          >
            <div className="w-1 h-1 bg-red-500 rounded-full" />
          </motion.div>
        );
      })}

      {/* Particles */}
      {particles.map((particle) => {
        const opacity = particle.life / particle.maxLife;
        return (
          <motion.div
            key={particle.id}
            className="fixed pointer-events-none z-[9998]"
            style={{
              left: particle.x - 1,
              top: particle.y - 1,
              opacity,
            }}
          >
            <div className="w-0.5 h-0.5 bg-red-500 rounded-full" />
          </motion.div>
        );
      })}
    </>
  );
}
