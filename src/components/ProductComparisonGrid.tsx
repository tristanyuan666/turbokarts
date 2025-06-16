"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, ChevronRight, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

interface GoKartModel {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  inventory: number;
  specs: {
    speed: string;
    battery: string;
    frame: string;
    weight: string;
  };
  features: string[];
  slug: string;
}

const ProductComparisonGrid = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { addItem } = useCart();

  const goKartModels: GoKartModel[] = [
    {
      id: "nighthawk",
      name: "Nighthawk",
      price: 279,
      originalPrice: 559,
      image: "/images/products/nighthawk.jpg",
      description:
        "Sleek entry model with impressive speed and style for value.",
      inventory: 7,
      specs: {
        speed: "25 mph",
        battery: "2 hours",
        frame: "Steel alloy",
        weight: "45 lbs",
      },
      features: [
        "Adjustable seat",
        "LED headlights",
        "Basic suspension",
        "Standard tires",
      ],
      slug: "nighthawk",
    },
    {
      id: "trackhawk",
      name: "Trackhawk",
      price: 399,
      originalPrice: 799,
      image: "/images/products/trackhawk.jpg",
      description:
        "Balanced performance and handling for the serious enthusiast.",
      inventory: 4,
      specs: {
        speed: "35 mph",
        battery: "3 hours",
        frame: "Carbon fiber blend",
        weight: "38 lbs",
      },
      features: [
        "Racing-grade seat",
        "LED lighting package",
        "Advanced suspension",
        "Performance tires",
        "Digital speedometer",
      ],
      slug: "trackhawk",
    },
    {
      id: "viperx",
      name: "Viper X",
      price: 549,
      originalPrice: 1099,
      image: "/images/products/viper-x.jpg",
      description:
        "Top of the line model with premium materials and unmatched power.",
      inventory: 5,
      specs: {
        speed: "45 mph",
        battery: "4 hours",
        frame: "Full carbon fiber",
        weight: "32 lbs",
      },
      features: [
        "Pro racing seat",
        "Full LED package with underglow",
        "Premium suspension system",
        "Competition-grade tires",
        "Digital dashboard",
        "Bluetooth connectivity",
        "Custom paint options",
      ],
      slug: "viper-x",
    },
  ];

  const { openCart } = useCart();

  const handleAddToCart = (model: GoKartModel) => {
    addItem({
      id: model.id,
      name: model.name,
      price: model.price,
      originalPrice: model.originalPrice!,
      image: model.image,
      color: "Stealth Black",
      tires: "Standard Grip",
      addOns: [],
    });
    // Immediately open cart drawer
    setTimeout(() => openCart(), 100);
  };

  return (
    <section
      id="models"
      className="w-full py-16 bg-white relative overflow-hidden"
    >
      {/* Racing-inspired background elements */}
      <div className="racing-lines">
        <div
          className="racing-line"
          style={{ top: "20%", animationDelay: "0s" }}
        />
        <div
          className="racing-line"
          style={{ top: "40%", animationDelay: "1s" }}
        />
        <div
          className="racing-line"
          style={{ top: "60%", animationDelay: "2s" }}
        />
      </div>
      <div className="tire-marks" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold mb-4 text-gray-900"
          >
            <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
              Meet the Fleet
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto text-gray-600 text-lg"
          >
            Choose your weapon. Each model engineered for pure adrenaline and
            built to dominate the track.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {goKartModels.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{
                y: -15,
                rotateX: 8,
                rotateY: 8,
                scale: 1.03,
              }}
              onMouseEnter={() => setHoveredCard(model.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="hover-3d group"
            >
              <Card className="bg-white border-gray-200 text-gray-900 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full group-hover:border-red-300 adrenaline-glow">
                <div className="relative overflow-hidden speed-blur">
                  <motion.div
                    className="absolute top-4 right-4 z-10"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                  >
                    <Badge className="bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg animate-pulse energy-pulse">
                      {Math.round(
                        ((model.originalPrice! - model.price) /
                          model.originalPrice!) *
                          100,
                      )}
                      % OFF
                    </Badge>
                  </motion.div>

                  {/* Inventory urgency badge */}
                  <motion.div
                    className="absolute top-4 left-4 z-10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2 + 0.5 }}
                  >
                    <Badge className="bg-black/80 text-white text-xs px-2 py-1 backdrop-blur-sm">
                      🔥 Only {model.inventory} left
                    </Badge>
                  </motion.div>

                  <div className="h-64 overflow-hidden relative group">
                    <motion.img
                      src={model.image}
                      alt={model.name}
                      className="w-full h-full object-cover transition-transform duration-700"
                      whileHover={{ scale: 1.2, rotate: 2 }}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80";
                      }}
                    />

                    {/* Dynamic overlay with racing effects */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-red-500/10 to-transparent opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.4 }}
                    />

                    {/* Speed lines effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent transform -translate-y-1/2 animate-pulse" />
                      <div
                        className="absolute top-1/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-400/40 to-transparent transform -translate-y-1/2"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="absolute top-2/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -translate-y-1/2"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>

                    {/* Hover stats overlay */}
                    <motion.div
                      className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100"
                      initial={{ y: 20 }}
                      whileHover={{ y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white">
                        <div className="flex justify-between text-sm">
                          <span>⚡ {model.specs.speed}</span>
                          <span>🔋 {model.specs.battery}</span>
                          <span>⚖️ {model.specs.weight}</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <motion.h3
                    className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {model.name}
                  </motion.h3>
                  <div className="flex items-baseline gap-3">
                    <motion.span
                      className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent"
                      key={model.price}
                      whileHover={{ scale: 1.1 }}
                    >
                      ${model.price}
                    </motion.span>
                    {model.originalPrice && (
                      <div className="flex flex-col">
                        <motion.span
                          className="text-sm text-gray-400 line-through"
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 0.7 }}
                        >
                          ${model.originalPrice}
                        </motion.span>
                        <span className="text-xs text-green-600 font-semibold">
                          Save ${model.originalPrice - model.price}
                        </span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 mb-4">{model.description}</p>

                  <div className="mb-6">
                    <h4 className="text-sm uppercase text-gray-500 mb-2">
                      Specifications
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500">Top Speed</p>
                        <p className="font-medium">{model.specs.speed}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500">Battery Life</p>
                        <p className="font-medium">{model.specs.battery}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500">Frame</p>
                        <p className="font-medium">{model.specs.frame}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500">Weight</p>
                        <p className="font-medium">{model.specs.weight}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm uppercase text-gray-500 mb-2">
                      Features
                    </h4>
                    <ul className="space-y-1">
                      {model.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Check size={14} className="text-red-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm text-green-600 font-medium">
                        In Stock
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <span>🚀</span>
                      Ships in 48hrs
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 pt-6">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full"
                  >
                    <Button
                      className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white flex items-center justify-center gap-2 relative overflow-hidden font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => handleAddToCart(model)}
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <ShoppingCart size={18} className="relative z-10" />
                      </motion.div>
                      <span className="relative z-10">
                        Add to Cart - ${model.price}
                      </span>

                      {/* Animated background */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      className="w-full border-2 border-gray-300 text-gray-900 hover:border-red-500 hover:text-red-600 hover:bg-red-50 relative overflow-hidden group py-3 rounded-xl font-medium transition-all duration-300"
                      asChild
                    >
                      <Link
                        href={`/products/${model.slug}`}
                        className="flex items-center justify-center gap-2"
                      >
                        <span className="relative z-10">
                          🎨 Configure & Customize
                        </span>
                        <motion.div
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <ChevronRight size={16} className="relative z-10" />
                        </motion.div>
                      </Link>
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductComparisonGrid;
