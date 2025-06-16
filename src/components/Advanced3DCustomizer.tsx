"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  useGLTF,
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";
import {
  RotateCcw,
  Maximize2,
  Play,
  Pause,
  Palette,
  Settings,
  Zap,
  Shield,
  Smartphone,
  Eye,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import * as THREE from "three";

interface CustomizationConfig {
  color: string;
  wheels: string;
  lights: boolean;
  spoiler: boolean;
  underglow: boolean;
  performance: number;
}

interface HotspotData {
  position: [number, number, number];
  title: string;
  description: string;
  category: string;
}

// Enhanced 3D Go-Kart Model with hotspots
function Enhanced3DGoKart({
  config,
  onHotspotClick,
  showHotspots = true,
}: {
  config: CustomizationConfig;
  onHotspotClick: (category: string) => void;
  showHotspots?: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  const hotspots: HotspotData[] = [
    {
      position: [0, 0.8, 0.5],
      title: "Body Color",
      description: "Customize your kart's paint job",
      category: "color",
    },
    {
      position: [-1, 0, -0.6],
      title: "Wheels",
      description: "Choose performance tires",
      category: "wheels",
    },
    {
      position: [0, 0.3, -0.8],
      title: "LED Lights",
      description: "Add underglow lighting",
      category: "lights",
    },
    {
      position: [0, 0.6, -0.9],
      title: "Spoiler",
      description: "Aerodynamic enhancement",
      category: "spoiler",
    },
    {
      position: [0, 0.4, 0.9],
      title: "Performance",
      description: "Engine and speed upgrades",
      category: "performance",
    },
  ];

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main chassis */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3, 0.3, 1.5]} />
        <meshStandardMaterial
          color={config.color}
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>

      {/* Seat */}
      <mesh position={[0.5, 0.8, 0]}>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Wheels with custom materials */}
      {[
        [-1, 0, -0.6],
        [1, 0, -0.6],
        [-1, 0, 0.6],
        [1, 0, 0.6],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
            <meshStandardMaterial
              color={config.wheels === "performance" ? "#ff4444" : "#2a2a2a"}
              metalness={config.wheels === "chrome" ? 0.9 : 0.1}
              roughness={config.wheels === "chrome" ? 0.1 : 0.8}
            />
          </mesh>
        </group>
      ))}

      {/* Spoiler (conditional) */}
      {config.spoiler && (
        <mesh position={[0, 1.2, -0.8]}>
          <boxGeometry args={[1.5, 0.1, 0.3]} />
          <meshStandardMaterial
            color={config.color}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      )}

      {/* LED Underglow (conditional) */}
      {config.underglow && (
        <>
          <mesh position={[0, 0.2, 0.76]}>
            <boxGeometry args={[2.5, 0.05, 0.05]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={0.8}
            />
          </mesh>
          <mesh position={[0, 0.2, -0.76]}>
            <boxGeometry args={[2.5, 0.05, 0.05]} />
            <meshStandardMaterial
              color="#ff0040"
              emissive="#ff0040"
              emissiveIntensity={0.8}
            />
          </mesh>
        </>
      )}

      {/* Interactive Hotspots */}
      {showHotspots &&
        hotspots.map((hotspot, index) => (
          <Html key={index} position={hotspot.position}>
            <motion.div
              className="relative cursor-pointer"
              whileHover={{ scale: 1.2 }}
              onHoverStart={() => setHoveredHotspot(hotspot.category)}
              onHoverEnd={() => setHoveredHotspot(null)}
              onClick={() => onHotspotClick(hotspot.category)}
            >
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse" />

              <AnimatePresence>
                {hoveredHotspot === hotspot.category && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap backdrop-blur-sm"
                  >
                    <div className="font-semibold">{hotspot.title}</div>
                    <div className="text-xs opacity-80">
                      {hotspot.description}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Html>
        ))}
    </group>
  );
}

// AI Style Coach Component
function AIStyleCoach({
  config,
  onSuggestion,
}: {
  config: CustomizationConfig;
  onSuggestion: (suggestion: Partial<CustomizationConfig>) => void;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    setIsThinking(true);
    const timer = setTimeout(() => {
      const newSuggestions = generateSuggestions(config);
      setSuggestions(newSuggestions);
      setIsThinking(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [config]);

  const generateSuggestions = (config: CustomizationConfig): string[] => {
    const suggestions = [];

    if (config.color === "#ff0040" && !config.underglow) {
      suggestions.push("Red karts look amazing with underglow lighting!");
    }

    if (config.performance > 80 && !config.spoiler) {
      suggestions.push("High performance setup needs a spoiler for stability.");
    }

    if (config.wheels === "standard" && config.performance > 60) {
      suggestions.push("Performance tires would complement your speed setup.");
    }

    return suggestions.slice(0, 2);
  };

  return (
    <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-yellow-400" />
          AI Style Coach
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {isThinking ? (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            Analyzing your style...
          </div>
        ) : (
          suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="text-sm text-gray-300 p-2 bg-yellow-400/10 rounded border border-yellow-400/20"
            >
              💡 {suggestion}
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

interface Advanced3DCustomizerProps {
  productName: string;
  onConfigChange: (config: CustomizationConfig) => void;
}

export default function Advanced3DCustomizer({
  productName,
  onConfigChange,
}: Advanced3DCustomizerProps) {
  const [config, setConfig] = useState<CustomizationConfig>({
    color: "#ff0040",
    wheels: "standard",
    lights: true,
    spoiler: false,
    underglow: false,
    performance: 50,
  });

  const [activeCategory, setActiveCategory] = useState<string>("color");
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<"3d" | "ar">("3d");

  const categories = [
    { id: "color", name: "Color", icon: Palette },
    { id: "wheels", name: "Wheels", icon: Settings },
    { id: "lights", name: "Lighting", icon: Lightbulb },
    { id: "performance", name: "Performance", icon: Zap },
    { id: "accessories", name: "Accessories", icon: Shield },
  ];

  const colors = [
    { name: "Inferno Red", value: "#ff0040" },
    { name: "Stealth Black", value: "#1a1a1a" },
    { name: "Ghost White", value: "#f8f8f8" },
    { name: "Cobalt Blue", value: "#0066cc" },
    { name: "Neon Green", value: "#00ff88" },
    { name: "Chrome Silver", value: "#c0c0c0" },
  ];

  const wheelOptions = [
    { name: "Standard", value: "standard" },
    { name: "Performance", value: "performance" },
    { name: "Chrome", value: "chrome" },
    { name: "Off-Road", value: "offroad" },
  ];

  const updateConfig = (updates: Partial<CustomizationConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const handleHotspotClick = (category: string) => {
    setActiveCategory(category);
  };

  const resetView = () => {
    setConfig({
      color: "#ff0040",
      wheels: "standard",
      lights: true,
      spoiler: false,
      underglow: false,
      performance: 50,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[800px]">
      {/* 3D Viewer */}
      <div className="lg:col-span-2 relative bg-gradient-to-br from-zinc-900 to-black rounded-2xl overflow-hidden">
        <Canvas
          camera={{ position: [0, 2, 5], fov: 50 }}
          className="cursor-grab active:cursor-grabbing"
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <spotLight
              position={[10, 10, 10]}
              angle={0.15}
              penumbra={1}
              intensity={1}
              castShadow
            />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />

            <Enhanced3DGoKart
              config={config}
              onHotspotClick={handleHotspotClick}
              showHotspots={showHotspots}
            />

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
              autoRotate={isAutoRotating}
              autoRotateSpeed={2}
              minDistance={3}
              maxDistance={8}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI - Math.PI / 6}
            />
          </Suspense>
        </Canvas>

        {/* 3D Viewer Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
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
            onClick={() => setShowHotspots(!showHotspots)}
          >
            <Eye size={16} />
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
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Maximize2 size={16} />
          </Button>
        </div>

        {/* Info Badge */}
        <div className="absolute top-4 left-4 glass-premium px-3 py-1 rounded-full">
          <p className="text-white text-sm font-medium">Interactive 3D Model</p>
        </div>
      </div>

      {/* Customization Panel */}
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-2 ${
                  activeCategory === category.id
                    ? "bg-red-600 text-white"
                    : "glass-premium border-zinc-700 text-white hover:bg-red-500/20"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <Icon size={14} />
                <span className="text-xs">{category.name}</span>
              </Button>
            );
          })}
        </div>

        {/* Category Content */}
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
          <CardContent className="p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeCategory === "color" && (
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Choose Color</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {colors.map((color) => (
                        <button
                          key={color.value}
                          className={`aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                            config.color === color.value
                              ? "border-red-500 shadow-lg shadow-red-500/50"
                              : "border-zinc-700 hover:border-zinc-500"
                          }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => updateConfig({ color: color.value })}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {activeCategory === "wheels" && (
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Wheel Type</h3>
                    <div className="space-y-2">
                      {wheelOptions.map((wheel) => (
                        <button
                          key={wheel.value}
                          className={`w-full p-3 rounded-lg border text-left transition-all ${
                            config.wheels === wheel.value
                              ? "border-red-500 bg-red-500/10 text-white"
                              : "border-zinc-700 text-gray-300 hover:border-zinc-600"
                          }`}
                          onClick={() => updateConfig({ wheels: wheel.value })}
                        >
                          {wheel.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeCategory === "lights" && (
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">
                      Lighting Options
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-gray-300">LED Headlights</span>
                        <input
                          type="checkbox"
                          checked={config.lights}
                          onChange={(e) =>
                            updateConfig({ lights: e.target.checked })
                          }
                          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-300">Underglow Kit</span>
                        <input
                          type="checkbox"
                          checked={config.underglow}
                          onChange={(e) =>
                            updateConfig({ underglow: e.target.checked })
                          }
                          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {activeCategory === "performance" && (
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">
                      Performance Level
                    </h3>
                    <div className="space-y-3">
                      <Slider
                        value={[config.performance]}
                        onValueChange={([value]) =>
                          updateConfig({ performance: value })
                        }
                        max={100}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Eco</span>
                        <span>Sport</span>
                        <span>Race</span>
                      </div>
                      <div className="text-center">
                        <Badge className="bg-red-600 text-white">
                          {config.performance}% Power
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                {activeCategory === "accessories" && (
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Accessories</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-gray-300">Racing Spoiler</span>
                        <input
                          type="checkbox"
                          checked={config.spoiler}
                          onChange={(e) =>
                            updateConfig({ spoiler: e.target.checked })
                          }
                          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* AI Style Coach */}
        <AIStyleCoach config={config} onSuggestion={updateConfig} />

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 glass-premium border-zinc-700 text-white hover:bg-red-500/20"
            onClick={resetView}
          >
            Reset
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            Save Build
          </Button>
        </div>
      </div>
    </div>
  );
}
