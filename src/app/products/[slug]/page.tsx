"use client";

import React, { useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  ChevronRight,
  Clock,
  Shield,
  Truck,
  ShoppingCart,
  Plus,
  ArrowLeft,
  Star,
  Heart,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

// Mock product data - in a real app, this would come from an API or database
const products = {
  nighthawk: {
    name: "Nighthawk",
    tagline: "Sleek Entry Model",
    price: 279,
    originalPrice: 559,
    description:
      "The Nighthawk combines sleek design with impressive performance, perfect for beginners and casual riders looking for an exhilarating experience without breaking the bank.",
    inventory: 7,
    maxSpeed: "25 mph",
    batteryLife: "2 hours",
    weight: "65 lbs",
    ageRecommendation: "12+",
    weightCapacity: "220 lbs",
    colors: ["Stealth Black", "Inferno Red", "Ghost White"],
    tires: ["Standard Grip", "Phantom Drifters"],
    addOns: [
      { name: "LED Underglow Kit", price: 49 },
      { name: "Racing Stripes", price: 29 },
      { name: "Smartphone Mount", price: 19 },
    ],
    mainImage: "/images/products/nighthawk.jpg",
    galleryImages: [
      "/images/products/nighthawk.jpg",
      "/images/products/nighthawk-side.jpg",
      "/images/products/nighthawk-action.jpg",
    ],
    features: [
      "Lightweight aluminum frame",
      "Responsive electric motor",
      "Adjustable seat position",
      "Integrated LED headlights",
      "Dual disc brakes",
    ],
  },
  trackhawk: {
    name: "Trackhawk",
    tagline: "Balanced Performance & Handling",
    price: 399,
    originalPrice: 799,
    description:
      "The Trackhawk delivers exceptional balance between raw power and precise handling. Designed for enthusiasts who demand more from their ride without stepping into professional territory.",
    inventory: 4,
    maxSpeed: "35 mph",
    batteryLife: "3 hours",
    weight: "72 lbs",
    ageRecommendation: "14+",
    weightCapacity: "250 lbs",
    colors: ["Stealth Black", "Inferno Red", "Ghost White", "Cobalt Blue"],
    tires: ["Performance Grip", "Urban Burnouts", "All-Terrain"],
    addOns: [
      { name: "LED Underglow Kit", price: 49 },
      { name: "Racing Stripes", price: 29 },
      { name: "Performance Spoiler", price: 59 },
      { name: "Smartphone Mount", price: 19 },
    ],
    mainImage: "/images/products/trackhawk.jpg",
    galleryImages: [
      "/images/products/trackhawk.jpg",
      "/images/products/trackhawk-side.jpg",
      "/images/products/trackhawk-action.jpg",
    ],
    features: [
      "Reinforced steel frame",
      "High-torque electric motor",
      "Adjustable suspension",
      "Advanced LED lighting system",
      "Hydraulic disc brakes",
      "Digital speedometer",
    ],
  },
  "viper-x": {
    name: "Viper X",
    tagline: "Ultimate Performance Machine",
    price: 549,
    originalPrice: 1099,
    description:
      "The Viper X represents the pinnacle of go-kart engineering. Built with premium materials and cutting-edge technology, this limited edition model delivers an unmatched riding experience for true enthusiasts.",
    inventory: 5,
    maxSpeed: "45 mph",
    batteryLife: "4 hours",
    weight: "78 lbs",
    ageRecommendation: "16+",
    weightCapacity: "280 lbs",
    colors: ["Stealth Black", "Inferno Red", "Ghost White", "Carbon Fiber"],
    tires: ["Pro Racing", "Urban Burnouts", "All-Terrain Pro"],
    addOns: [
      { name: "Premium LED Underglow Kit", price: 79 },
      { name: "Carbon Fiber Accents", price: 99 },
      { name: "Performance Spoiler", price: 59 },
      { name: "Smartphone Mount", price: 19 },
      { name: "Racing Harness", price: 49 },
    ],
    mainImage: "/images/products/viper-x.jpg",
    galleryImages: [
      "/images/products/viper-x.jpg",
      "/images/products/viper-x-side.jpg",
      "/images/products/viper-x-action.jpg",
    ],
    features: [
      "Carbon fiber reinforced frame",
      "Dual high-output electric motors",
      "Premium adjustable suspension",
      "Advanced LED lighting system with customizable patterns",
      "Performance hydraulic disc brakes",
      "Digital dashboard with Bluetooth connectivity",
      "Selectable driving modes (Eco, Sport, Race)",
    ],
  },
};

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const product = products[slug as keyof typeof products];

  // If product doesn't exist, return 404 before using any hooks
  if (!product) {
    notFound();
  }

  const { addItem, openCart } = useCart();

  const [selectedColor, setSelectedColor] = useState(
    product?.colors[0] || "Stealth Black",
  );
  const [selectedTires, setSelectedTires] = useState(
    product?.tires[0] || "Standard Grip",
  );
  const [selectedAddOns, setSelectedAddOns] = useState<
    Array<{ name: string; price: number }>
  >([]);

  // Calculate discount percentage
  const discountPercentage = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  // Calculate estimated delivery date (2 weeks from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 14);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const handleAddToCart = () => {
    addItem({
      id: `${slug}-${selectedColor}-${selectedTires}-${selectedAddOns.length}`,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.mainImage,
      color: selectedColor,
      tires: selectedTires,
      addOns: selectedAddOns,
    });
    openCart();
  };

  const toggleAddOn = (addOn: { name: string; price: number }) => {
    setSelectedAddOns((prev) => {
      const exists = prev.find((item) => item.name === addOn.name);
      if (exists) {
        return prev.filter((item) => item.name !== addOn.name);
      } else {
        return [...prev, addOn];
      }
    });
  };

  // Calculate total price including add-ons
  const totalPrice =
    product.price + selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);

  return (
    <div className="bg-white min-h-screen text-gray-900">
      {/* Luxury Automotive Navigation */}
      <nav className="ultra-glass border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold hover:text-red-600 transition-colors text-gray-900"
          >
            <div className="h-8 w-8 relative">
              <ImageWithFallback
                src="/images/turbokart-logo.png"
                alt="TurboKart Logo"
                width={32}
                height={32}
                className="object-contain"
                fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23dc2626' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M8 6v6h8V6'/%3E%3Cpath d='M6 12v6h12v-6'/%3E%3Cpath d='M2 18h20'/%3E%3C/svg%3E"
              />
            </div>
            TurboKart
          </Link>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              asChild
              className="btn-premium text-gray-600"
            >
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Luxury Offer Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-50 via-red-100 to-red-50 border-b border-red-200 py-4 px-4 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent animate-pulse" />
        <p className="text-sm font-medium text-red-800 relative z-10">
          ⚡ Exclusive: Save {discountPercentage}% on the {product.name} • Only{" "}
          {product.inventory} units remaining • Free Premium Shipping
        </p>
      </motion.div>

      {/* Hero Stats Bar */}
      <div className="bg-gray-50 border-b border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="scroll-reveal">
              <div className="text-5xl font-bold text-red-600">
                {product.maxSpeed}
              </div>
              <div className="text-sm text-gray-600">Top Speed</div>
            </div>
            <div className="scroll-reveal" style={{ animationDelay: "0.1s" }}>
              <div className="text-2xl font-bold text-red-600">
                {product.batteryLife}
              </div>
              <div className="text-sm text-gray-600">Battery Life</div>
            </div>
            <div className="scroll-reveal" style={{ animationDelay: "0.2s" }}>
              <div className="text-2xl font-bold text-red-600">
                {product.ageRecommendation}
              </div>
              <div className="text-sm text-gray-600">Age Range</div>
            </div>
            <div className="scroll-reveal" style={{ animationDelay: "0.3s" }}>
              <div className="text-2xl font-bold text-red-600">
                {product.weightCapacity}
              </div>
              <div className="text-sm text-gray-600">Max Weight</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Luxury Product Gallery */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-2xl"
            >
              <ImageWithFallback
                src={product.mainImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
                fallbackSrc="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
              />

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-6 left-6"
              >
                <Badge className="bg-red-600 text-white shadow-xl px-3 py-1">
                  {discountPercentage}% OFF
                </Badge>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute top-6 right-6"
              >
                <Badge className="ultra-glass text-red-600 border border-red-200 animate-pulse shadow-xl px-3 py-1">
                  Only {product.inventory} left
                </Badge>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-6 right-6"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="ultra-glass hover:bg-white/20 text-gray-600 hover:text-red-600 rounded-full shadow-xl backdrop-blur-md"
                >
                  <Heart size={20} />
                </Button>
              </motion.div>

              {/* Luxury overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </motion.div>

            {/* Premium Gallery Grid */}
            <div className="grid grid-cols-3 gap-4">
              {product.galleryImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50 border border-gray-200 hover:border-red-300 transition-all cursor-pointer group shadow-lg hover:shadow-xl"
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    fallbackSrc="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>

            {/* Luxury Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                {
                  icon: Shield,
                  title: "2-Year Warranty",
                  subtitle: "Full Coverage",
                },
                { icon: Truck, title: "Free Shipping", subtitle: "Worldwide" },
                { icon: Star, title: "4.9/5 Rating", subtitle: "10K+ Reviews" },
              ].map((badge, index) => {
                const IconComponent = badge.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="text-center p-6 ultra-glass rounded-2xl hover:shadow-lg transition-all group cursor-pointer"
                  >
                    <IconComponent
                      className="h-8 w-8 text-red-500 mx-auto mb-3 group-hover:scale-110 transition-transform"
                      fill={badge.icon === Star ? "currentColor" : "none"}
                    />
                    <p className="text-sm font-medium text-gray-900">
                      {badge.title}
                    </p>
                    <p className="text-xs text-gray-600">{badge.subtitle}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Luxury Product Details */}
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold mb-4 text-gray-900">
                {product.name}
              </h1>
              <p className="text-2xl text-red-600 font-medium mb-6">
                {product.tagline}
              </p>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-red-600 text-red-600"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  4.9 (2,847 reviews)
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-6 mb-8"
            >
              <span className="text-5xl font-bold text-red-600">
                ${totalPrice.toLocaleString()}
              </span>
              <div className="flex flex-col">
                <span className="text-xl text-gray-400 line-through">
                  $
                  {(
                    product.originalPrice +
                    selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0)
                  ).toLocaleString()}
                </span>
                <Badge className="bg-green-100 text-green-800 border border-green-200 mt-1">
                  Save $
                  {(
                    product.originalPrice +
                    selectedAddOns.reduce(
                      (sum, addOn) => sum + addOn.price,
                      0,
                    ) -
                    totalPrice
                  ).toLocaleString()}
                </Badge>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl leading-relaxed mb-8 text-gray-600"
            >
              {product.description}
            </motion.p>

            {/* Luxury Urgency & Delivery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="ultra-glass border border-red-200 rounded-2xl p-6 space-y-4 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-transparent" />
              <div className="flex items-center space-x-3 text-red-700 relative z-10">
                <Clock size={20} className="animate-pulse" />
                <span className="font-medium text-lg">
                  ⚡ Exclusive: Only {product.inventory} units remaining -
                  Reserve yours now
                </span>
              </div>
              <div className="flex items-center space-x-3 relative z-10 text-gray-600">
                <Truck size={20} />
                <span>
                  🚚 Premium shipping within 48 hours • Delivery by{" "}
                  {formattedDeliveryDate}
                </span>
              </div>
            </motion.div>

            {/* Luxury Customization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-8"
            >
              <h3 className="text-3xl font-bold text-gray-900">
                Customize Your {product.name}
              </h3>

              {/* Premium Color Selection */}
              <div className="ultra-glass rounded-2xl p-8">
                <h4 className="text-lg font-medium mb-6 text-gray-900">
                  Select Color
                </h4>
                <div className="flex space-x-3">
                  {product.colors.map((color, index) => {
                    // Map color names to actual color values
                    const colorMap: Record<string, string> = {
                      "Stealth Black": "bg-black border-gray-300",
                      "Inferno Red": "bg-red-600",
                      "Ghost White": "bg-white border-gray-300",
                      "Cobalt Blue": "bg-blue-600",
                      "Carbon Fiber": "bg-gray-800 border-gray-300",
                    };

                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full ${colorMap[color] || "bg-gray-500"} 
                                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white
                                  ${selectedColor === color ? "ring-2 ring-red-500 ring-offset-2 ring-offset-white shadow-lg" : "border"}`}
                        aria-label={color}
                      />
                    );
                  })}
                </div>
                <p className="text-sm mt-4 text-gray-600">
                  Selected: <span className="font-medium">{selectedColor}</span>
                </p>
              </div>

              {/* Premium Tire Selection */}
              <div className="ultra-glass rounded-2xl p-8">
                <h4 className="text-lg font-medium mb-6 text-gray-900">
                  Select Tires
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {product.tires.map((tire, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTires(tire)}
                      className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium
                                ${
                                  selectedTires === tire
                                    ? "border-red-500 bg-red-50 text-red-700"
                                    : "border-gray-300 hover:border-red-300 text-gray-700"
                                }`}
                    >
                      {tire}
                    </button>
                  ))}
                </div>
              </div>

              {/* Premium Add-ons */}
              <div className="ultra-glass rounded-2xl p-8">
                <h4 className="text-lg font-medium mb-6 text-gray-900">
                  Recommended Add-ons
                </h4>
                <div className="space-y-3">
                  {product.addOns.map((addon, index) => {
                    const isSelected = selectedAddOns.find(
                      (item) => item.name === addon.name,
                    );
                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 border rounded-lg transition-all
                                  ${isSelected ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-red-300"}`}
                      >
                        <span className="font-medium text-gray-900">
                          {addon.name}
                        </span>
                        <div className="flex items-center space-x-3">
                          <span className="text-red-600 font-semibold">
                            +${addon.price}
                          </span>
                          <Button
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleAddOn(addon)}
                            className={
                              isSelected
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "border-red-500 text-red-600 hover:bg-red-50"
                            }
                          >
                            {isSelected ? "Remove" : "Add"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Luxury Purchase CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="sticky bottom-0 ultra-glass border-t border-gray-200 py-8 -mx-4 px-4 backdrop-blur-xl"
            >
              <div className="space-y-4">
                <Button
                  onClick={handleAddToCart}
                  className="w-full btn-premium bg-red-600 hover:bg-red-700 text-white py-6 text-xl font-semibold flex items-center justify-center gap-3 rounded-2xl shadow-2xl hover:shadow-3xl transition-all cart-bounce"
                >
                  <ShoppingCart size={24} />
                  Add to Cart - ${totalPrice.toLocaleString()}
                </Button>
                <Button
                  variant="outline"
                  className="w-full btn-premium border-2 border-gray-300 hover:border-red-600 hover:text-red-600 py-4 font-semibold rounded-2xl transition-all text-gray-900"
                  asChild
                >
                  <Link href="/checkout">Buy Now - Express Checkout</Link>
                </Button>
              </div>
              <p className="text-center text-sm mt-4 text-gray-600">
                ✅ Free premium shipping • 🔄 30-day returns • 🛡️ 2-year
                warranty • 🏆 Lifetime support
              </p>
            </motion.div>
          </div>
        </div>

        {/* Product Specifications and Features */}
        <div className="mt-20">
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-xl">
              <TabsTrigger value="specs" className="rounded-lg">
                Specifications
              </TabsTrigger>
              <TabsTrigger value="features" className="rounded-lg">
                Features
              </TabsTrigger>
              <TabsTrigger value="warranty" className="rounded-lg">
                Warranty & Shipping
              </TabsTrigger>
            </TabsList>
            <TabsContent value="specs" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">
                      Performance
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Max Speed</span>
                        <span className="font-semibold text-gray-900">
                          {product.maxSpeed}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Battery Life</span>
                        <span className="font-semibold text-gray-900">
                          {product.batteryLife}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Weight</span>
                        <span className="font-semibold text-gray-900">
                          {product.weight}
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">
                      Rider Information
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span className="text-gray-600">
                          Age Recommendation
                        </span>
                        <span className="font-semibold text-gray-900">
                          {product.ageRecommendation}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Weight Capacity</span>
                        <span className="font-semibold text-gray-900">
                          {product.weightCapacity}
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">
                      What's Included
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Check size={16} className="text-red-500 mr-2" />
                        <span className="text-gray-700">
                          {product.name} Go-Kart
                        </span>
                      </li>
                      <li className="flex items-center">
                        <Check size={16} className="text-red-500 mr-2" />
                        <span className="text-gray-700">
                          Charging Equipment
                        </span>
                      </li>
                      <li className="flex items-center">
                        <Check size={16} className="text-red-500 mr-2" />
                        <span className="text-gray-700">User Manual</span>
                      </li>
                      <li className="flex items-center">
                        <Check size={16} className="text-red-500 mr-2" />
                        <span className="text-gray-700">Assembly Tools</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="features" className="mt-8">
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                  Premium Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        <Check size={16} className="text-red-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="warranty" className="mt-8">
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center mb-4">
                      <Shield size={24} className="text-red-500 mr-2" />
                      <h3 className="text-xl font-semibold text-gray-900">
                        Warranty
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Every {product.name} comes with our comprehensive 2-year
                      warranty covering manufacturing defects and mechanical
                      failures.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Check size={16} className="text-red-500 mr-2" />
                        <span className="text-gray-700">
                          2-Year Full Coverage
                        </span>
                      </li>
                      <li className="flex items-center">
                        <Check size={16} className="text-red-500 mr-2" />
                        <span className="text-gray-700">Free Repairs</span>
                      </li>
                      <li className="flex items-center">
                        <Check size={16} className="text-red-500 mr-2" />
                        <span className="text-gray-700">Parts Replacement</span>
                      </li>
                    </ul>
                    <Button
                      variant="link"
                      className="text-red-600 p-0 mt-2 flex items-center hover:text-red-700"
                    >
                      View Full Warranty Details <ChevronRight size={16} />
                    </Button>
                  </div>

                  <div>
                    <div className="flex items-center mb-4">
                      <Truck size={24} className="text-red-500 mr-2" />
                      <h3 className="text-xl font-semibold text-gray-900">
                        Shipping & Returns
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      We offer free worldwide shipping on all orders and a
                      hassle-free 30-day return policy.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Check size={16} className="text-red-500 mr-2" />
                        <span className="text-gray-700">
                          Free Worldwide Shipping
                        </span>
                      </li>
                      <li className="flex items-center">
                        <Check size={16} className="text-red-500 mr-2" />
                        <span className="text-gray-700">
                          30-Day Money-Back Guarantee
                        </span>
                      </li>
                      <li className="flex items-center">
                        <Check size={16} className="text-red-500 mr-2" />
                        <span className="text-gray-700">
                          Hassle-Free Returns
                        </span>
                      </li>
                    </ul>
                    <Button
                      variant="link"
                      className="text-red-600 p-0 mt-2 flex items-center hover:text-red-700"
                    >
                      View Shipping & Returns Policy <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(products)
              .filter(([key]) => key !== slug)
              .map(([key, relatedProduct]) => (
                <Card
                  key={key}
                  className="bg-white border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-video">
                    <ImageWithFallback
                      src={relatedProduct.mainImage}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover"
                      fallbackSrc="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {relatedProduct.tagline}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">
                          ${relatedProduct.price}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          ${relatedProduct.originalPrice}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-600 hover:bg-red-50"
                        asChild
                      >
                        <Link href={`/products/${key}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
