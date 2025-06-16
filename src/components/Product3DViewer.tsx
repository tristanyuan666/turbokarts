"use client";

import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { RotateCcw, Maximize2, Play, Pause } from "lucide-react";

interface Product3DViewerProps {
  modelUrl?: string;
  productName: string;
  autoRotate?: boolean;
  showControls?: boolean;
  className?: string;
}

// Simple 3D Go-Kart representation (placeholder for actual 3D model)
function GoKartModel({ color = "#ff0040" }: { color?: string }) {
  const meshRef = useRef<any>();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      {/* Main chassis */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3, 0.3, 1.5]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Seat */}
      <mesh position={[0.5, 0.8, 0]}>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Wheels */}
      {[
        [-1, 0, -0.6],
        [1, 0, -0.6],
        [-1, 0, 0.6],
        [1, 0, 0.6],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      ))}

      {/* LED strips */}
      <mesh position={[0, 0.3, 0.76]}>
        <boxGeometry args={[2.5, 0.05, 0.05]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
        />
      </mesh>

      <mesh position={[0, 0.3, -0.76]}>
        <boxGeometry args={[2.5, 0.05, 0.05]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

function Scene({
  productColor,
  autoRotate,
}: {
  productColor: string;
  autoRotate: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <GoKartModel color={productColor} />

      <ContactShadows
        position={[0, -1, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />

      <Environment preset="city" />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        autoRotate={autoRotate}
        autoRotateSpeed={2}
        minDistance={3}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
      />
    </>
  );
}

export default function Product3DViewer({
  modelUrl,
  productName,
  autoRotate = true,
  showControls = true,
  className = "",
}: Product3DViewerProps) {
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);
  const [productColor, setProductColor] = useState("#ff0040");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const colors = [
    { name: "Inferno Red", value: "#ff0040" },
    { name: "Stealth Black", value: "#1a1a1a" },
    { name: "Ghost White", value: "#f8f8f8" },
    { name: "Cobalt Blue", value: "#0066cc" },
  ];

  const resetView = () => {
    // Reset camera position - would need ref to OrbitControls
    console.log("Reset view");
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <motion.div
      className={`relative bg-gradient-to-br from-zinc-900 to-black rounded-2xl overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* 3D Canvas */}
      <div
        className={`${isFullscreen ? "fixed inset-0 z-50" : "aspect-square"} bg-gradient-to-br from-zinc-900 to-black`}
      >
        <Canvas
          camera={{ position: [0, 2, 5], fov: 50 }}
          className="cursor-grab active:cursor-grabbing"
        >
          <Suspense fallback={null}>
            <Scene productColor={productColor} autoRotate={isAutoRotating} />
          </Suspense>
        </Canvas>

        {/* Loading overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-white text-center">
            <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm">Loading {productName}...</p>
          </div>
        </div>
      </div>

      {/* Controls Overlay */}
      {showControls && (
        <motion.div
          className="absolute top-4 right-4 flex flex-col gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="glass-premium text-white hover:text-red-500"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
          >
            {isAutoRotating ? <Pause size={16} /> : <Play size={16} />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="glass-premium text-white hover:text-red-500"
            onClick={resetView}
          >
            <RotateCcw size={16} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="glass-premium text-white hover:text-red-500"
            onClick={toggleFullscreen}
          >
            <Maximize2 size={16} />
          </Button>
        </motion.div>
      )}

      {/* Color Selector */}
      <motion.div
        className="absolute bottom-4 left-4 flex gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {colors.map((color) => (
          <button
            key={color.name}
            className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
              productColor === color.value
                ? "border-red-500 shadow-lg shadow-red-500/50"
                : "border-white/30 hover:border-white/60"
            }`}
            style={{ backgroundColor: color.value }}
            onClick={() => setProductColor(color.value)}
            title={color.name}
          />
        ))}
      </motion.div>

      {/* Info Badge */}
      <motion.div
        className="absolute top-4 left-4 glass-premium px-3 py-1 rounded-full"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-white text-sm font-medium">360° Interactive View</p>
      </motion.div>

      {/* Instructions */}
      <motion.div
        className="absolute bottom-4 right-4 glass-premium px-3 py-2 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-white/80 text-xs">Drag to rotate • Scroll to zoom</p>
      </motion.div>

      {/* Close fullscreen */}
      {isFullscreen && (
        <Button
          variant="ghost"
          className="absolute top-4 left-4 text-white z-10"
          onClick={toggleFullscreen}
        >
          ✕ Close
        </Button>
      )}
    </motion.div>
  );
}
