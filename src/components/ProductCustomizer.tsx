"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Slider } from "./ui/slider";
import {
  Palette,
  Settings,
  Zap,
  Shield,
  Music,
  Smartphone,
  Plus,
  Minus,
  Check,
} from "lucide-react";

interface CustomizationOption {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  popular?: boolean;
}

interface ProductCustomizerProps {
  productName: string;
  basePrice: number;
  originalPrice: number;
  onPriceChange: (newPrice: number) => void;
  onCustomizationChange: (customizations: any) => void;
}

const customizationOptions: CustomizationOption[] = [
  {
    id: "led-underglow",
    name: "LED Underglow Kit",
    description: "Customizable RGB lighting with app control",
    price: 79,
    category: "lighting",
    popular: true,
  },
  {
    id: "carbon-accents",
    name: "Carbon Fiber Accents",
    description: "Premium carbon fiber body panels",
    price: 149,
    category: "aesthetics",
  },
  {
    id: "performance-tires",
    name: "Performance Tires",
    description: "High-grip racing compound tires",
    price: 89,
    category: "performance",
    popular: true,
  },
  {
    id: "sound-system",
    name: "Bluetooth Sound System",
    description: "Waterproof speakers with bass boost",
    price: 129,
    category: "tech",
  },
  {
    id: "phone-mount",
    name: "Smartphone Mount",
    description: "Secure wireless charging mount",
    price: 39,
    category: "tech",
  },
  {
    id: "racing-harness",
    name: "5-Point Racing Harness",
    description: "Professional-grade safety harness",
    price: 99,
    category: "safety",
  },
  {
    id: "custom-wrap",
    name: "Custom Vinyl Wrap",
    description: "Personalized graphics and patterns",
    price: 199,
    category: "aesthetics",
  },
  {
    id: "extended-battery",
    name: "Extended Battery Pack",
    description: "Double your ride time with extra cells",
    price: 179,
    category: "performance",
  },
];

const colorOptions = [
  { name: "Stealth Black", value: "#1a1a1a", premium: false },
  { name: "Inferno Red", value: "#ff0040", premium: false },
  { name: "Ghost White", value: "#f8f8f8", premium: false },
  { name: "Cobalt Blue", value: "#0066cc", premium: true, price: 49 },
  { name: "Carbon Fiber", value: "#2a2a2a", premium: true, price: 99 },
  { name: "Chrome Silver", value: "#c0c0c0", premium: true, price: 149 },
];

const tireOptions = [
  { name: "Standard Grip", price: 0, description: "All-purpose tires" },
  {
    name: "Performance Pro",
    price: 59,
    description: "Enhanced grip and durability",
  },
  {
    name: "Off-Road Beast",
    price: 79,
    description: "Rugged terrain specialist",
  },
  { name: "Street Racer", price: 89, description: "Maximum speed and control" },
];

const categories = [
  { id: "color", name: "Color", icon: Palette },
  { id: "performance", name: "Performance", icon: Zap },
  { id: "aesthetics", name: "Aesthetics", icon: Settings },
  { id: "tech", name: "Technology", icon: Smartphone },
  { id: "safety", name: "Safety", icon: Shield },
  { id: "lighting", name: "Lighting", icon: Music },
];

export default function ProductCustomizer({
  productName,
  basePrice,
  originalPrice,
  onPriceChange,
  onCustomizationChange,
}: ProductCustomizerProps) {
  const [activeCategory, setActiveCategory] = useState("color");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [selectedTires, setSelectedTires] = useState(tireOptions[0]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(basePrice);
  const [animatingPrice, setAnimatingPrice] = useState(false);

  useEffect(() => {
    const colorPrice = selectedColor.premium ? selectedColor.price || 0 : 0;
    const tiresPrice = selectedTires.price;
    const optionsPrice = selectedOptions.reduce((sum, optionId) => {
      const option = customizationOptions.find((opt) => opt.id === optionId);
      return sum + (option?.price || 0);
    }, 0);

    const newTotal = basePrice + colorPrice + tiresPrice + optionsPrice;

    if (newTotal !== totalPrice) {
      setAnimatingPrice(true);
      setTimeout(() => {
        setTotalPrice(newTotal);
        onPriceChange(newTotal);
        setAnimatingPrice(false);
      }, 200);
    }

    onCustomizationChange({
      color: selectedColor,
      tires: selectedTires,
      options: selectedOptions
        .map((id) => customizationOptions.find((opt) => opt.id === id))
        .filter(Boolean),
    });
  }, [
    selectedColor,
    selectedTires,
    selectedOptions,
    basePrice,
    totalPrice,
    onPriceChange,
    onCustomizationChange,
  ]);

  const toggleOption = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId],
    );
  };

  const getCategoryOptions = () => {
    switch (activeCategory) {
      case "color":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Choose Your Color
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {colorOptions.map((color) => (
                <motion.button
                  key={color.name}
                  className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                    selectedColor.name === color.name
                      ? "border-red-500 bg-red-500/10"
                      : "border-zinc-700 hover:border-zinc-600"
                  }`}
                  onClick={() => setSelectedColor(color)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white/20"
                      style={{ backgroundColor: color.value }}
                    />
                    <div className="text-left">
                      <p className="text-white font-medium">{color.name}</p>
                      {color.premium && (
                        <p className="text-red-500 text-sm">+${color.price}</p>
                      )}
                    </div>
                  </div>
                  {color.premium && (
                    <Badge className="mt-2 bg-red-600 text-white">
                      Premium
                    </Badge>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "performance":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Performance Upgrades
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-white mb-2">Tire Selection</h4>
                <div className="grid grid-cols-1 gap-2">
                  {tireOptions.map((tire) => (
                    <motion.button
                      key={tire.name}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        selectedTires.name === tire.name
                          ? "border-red-500 bg-red-500/10 text-white"
                          : "border-zinc-700 text-gray-300 hover:border-zinc-600"
                      }`}
                      onClick={() => setSelectedTires(tire)}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{tire.name}</p>
                          <p className="text-sm opacity-80">
                            {tire.description}
                          </p>
                        </div>
                        {tire.price > 0 && (
                          <span className="text-red-500 font-medium">
                            +${tire.price}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {customizationOptions
                .filter((opt) => opt.category === "performance")
                .map((option) => (
                  <motion.div
                    key={option.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedOptions.includes(option.id)
                        ? "border-red-500 bg-red-500/10"
                        : "border-zinc-700 hover:border-zinc-600"
                    }`}
                    onClick={() => toggleOption(option.id)}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-white font-medium">
                            {option.name}
                          </h4>
                          {option.popular && (
                            <Badge className="bg-yellow-600 text-white text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mt-1">
                          {option.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-red-500 font-medium">
                          +${option.price}
                        </span>
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedOptions.includes(option.id)
                              ? "border-red-500 bg-red-500"
                              : "border-zinc-600"
                          }`}
                        >
                          {selectedOptions.includes(option.id) && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white capitalize">
              {activeCategory} Options
            </h3>
            <div className="space-y-3">
              {customizationOptions
                .filter((opt) => opt.category === activeCategory)
                .map((option) => (
                  <motion.div
                    key={option.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedOptions.includes(option.id)
                        ? "border-red-500 bg-red-500/10"
                        : "border-zinc-700 hover:border-zinc-600"
                    }`}
                    onClick={() => toggleOption(option.id)}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-white font-medium">
                            {option.name}
                          </h4>
                          {option.popular && (
                            <Badge className="bg-yellow-600 text-white text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mt-1">
                          {option.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-red-500 font-medium">
                          +${option.price}
                        </span>
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedOptions.includes(option.id)
                              ? "border-red-500 bg-red-500"
                              : "border-zinc-600"
                          }`}
                        >
                          {selectedOptions.includes(option.id) && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Customize Your {productName}</span>
          <motion.div
            className="text-right"
            animate={animatingPrice ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <div className="text-2xl font-bold text-red-500">
              ${totalPrice.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400 line-through">
              ${(originalPrice + (totalPrice - basePrice)).toLocaleString()}
            </div>
          </motion.div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category Navigation */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.id}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeCategory === category.id
                    ? "bg-red-600 text-white"
                    : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                }`}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{category.name}</span>
              </motion.button>
            );
          })}
        </div>

        <Separator className="bg-zinc-700" />

        {/* Category Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {getCategoryOptions()}
          </motion.div>
        </AnimatePresence>

        {/* Summary */}
        <div className="bg-zinc-800 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">Configuration Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Base {productName}</span>
              <span className="text-white">${basePrice}</span>
            </div>

            {selectedColor.premium && (
              <div className="flex justify-between">
                <span className="text-gray-400">{selectedColor.name}</span>
                <span className="text-red-500">+${selectedColor.price}</span>
              </div>
            )}

            {selectedTires.price > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">{selectedTires.name}</span>
                <span className="text-red-500">+${selectedTires.price}</span>
              </div>
            )}

            {selectedOptions.map((optionId) => {
              const option = customizationOptions.find(
                (opt) => opt.id === optionId,
              );
              return option ? (
                <div key={optionId} className="flex justify-between">
                  <span className="text-gray-400">{option.name}</span>
                  <span className="text-red-500">+${option.price}</span>
                </div>
              ) : null;
            })}

            <Separator className="bg-zinc-700" />

            <div className="flex justify-between font-medium">
              <span className="text-white">Total</span>
              <span className="text-red-500 text-lg">
                ${totalPrice.toLocaleString()}
              </span>
            </div>

            <div className="text-center text-green-500 text-xs">
              You save ${originalPrice + (totalPrice - basePrice) - totalPrice}{" "}
              (50% OFF)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
