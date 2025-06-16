"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { Button } from "./ui/button";

interface VideoShowcaseProps {
  title?: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  autoplay?: boolean;
}

export default function VideoShowcase({
  title = "Experience the Thrill",
  description = "Watch our go-karts in action and see why riders choose TurboKart for the ultimate racing experience.",
  videoUrl = "/videos/turbokart-showcase.mp4",
  thumbnailUrl = "https://images.unsplash.com/photo-1600706432502-77a0e2e31c7d?w=1200&q=80",
  autoplay = true,
}: VideoShowcaseProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <section className="w-full py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            {description}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div
            className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
            onClick={togglePlay}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              poster={thumbnailUrl}
              muted={isMuted}
              autoPlay={autoplay}
              loop
              playsInline
              onError={() => {
                // Fallback to image if video fails to load
                if (videoRef.current) {
                  videoRef.current.style.display = "none";
                }
              }}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Fallback image overlay if video fails */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${thumbnailUrl})` }}
              onLoad={() => {
                if (
                  videoRef.current &&
                  videoRef.current.style.display === "none"
                ) {
                  // Show fallback image
                }
              }}
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

            {/* Play button overlay */}
            {!isPlaying && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-6 border border-white/30"
                >
                  <Play
                    className="h-12 w-12 text-white ml-1"
                    fill="currentColor"
                  />
                </motion.div>
              </motion.div>
            )}

            {/* Video controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: showControls || !isPlaying ? 1 : 0,
                y: showControls || !isPlaying ? 0 : 20,
              }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 left-4 right-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </motion.div>

            {/* Racing-inspired overlay effects */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500/60 to-transparent animate-pulse" />
              <div
                className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                style={{ animationDelay: "0.3s" }}
              />
              <div
                className="absolute top-3/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500/40 to-transparent animate-pulse"
                style={{ animationDelay: "0.6s" }}
              />
            </div>
          </div>

          {/* Video stats with functional buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div
              className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-red-300 transition-all cursor-pointer group"
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() =>
                document
                  .getElementById("models")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <div className="text-2xl font-bold text-red-600 mb-2 group-hover:scale-110 transition-transform">
                45 MPH
              </div>
              <div className="text-sm text-gray-600">Top Speed Achieved</div>
              <div className="text-xs text-red-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                View Models →
              </div>
            </motion.div>
            <motion.div
              className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-red-300 transition-all cursor-pointer group"
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() =>
                document
                  .getElementById("models")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <div className="text-2xl font-bold text-red-600 mb-2 group-hover:scale-110 transition-transform">
                4 Hours
              </div>
              <div className="text-sm text-gray-600">Maximum Battery Life</div>
              <div className="text-xs text-red-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Learn More →
              </div>
            </motion.div>
            <motion.div
              className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-red-300 transition-all cursor-pointer group"
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() =>
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                })
              }
            >
              <div className="text-2xl font-bold text-red-600 mb-2 group-hover:scale-110 transition-transform">
                10K+
              </div>
              <div className="text-sm text-gray-600">Happy Customers</div>
              <div className="text-xs text-red-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Read Reviews →
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
