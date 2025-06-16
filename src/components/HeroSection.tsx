"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  ChevronDown,
  Star,
  Shield,
  Truck,
  ShoppingCart,
  Award,
  Users,
  Zap,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import MobileNavigation from "./MobileNavigation";
import ImageWithFallback from "./ImageWithFallback";
import Link from "next/link";

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  primaryCTA?: string;
  secondaryCTA?: string;
  rating?: number;
  reviewCount?: number;
}

export default function HeroSection({
  headline = "Premium Go-Karts Engineered for Excellence",
  subheadline = "Experience the perfect fusion of cutting-edge technology and premium craftsmanship. Built for enthusiasts who demand the ultimate in performance and style.",
  primaryCTA = "Explore Models",
  secondaryCTA = "Configure Yours",
  rating = 4.9,
  reviewCount = 10000,
}: HeroSectionProps) {
  const [typedText, setTypedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Safely use cart context with error handling
  let cartState = { itemCount: 0 };
  let toggleCartFn = () => {};

  try {
    const { state, toggleCart } = useCart();
    cartState = state;
    toggleCartFn = toggleCart;
  } catch (error) {
    console.warn("Cart context not available in HeroSection");
  }

  // Typing animation effect
  useEffect(() => {
    if (typedText.length < headline.length) {
      const timeout = setTimeout(() => {
        setTypedText(headline.slice(0, typedText.length + 1));
      }, 80);
      return () => clearTimeout(timeout);
    } else {
      setIsTypingComplete(true);
    }
  }, [typedText, headline]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-red-50/20">
      {/* Enhanced Background with Racing Elements */}
      <div className="absolute inset-0">
        {/* Racing lines background */}
        <div className="racing-lines">
          <div
            className="racing-line"
            style={{ top: "15%", animationDelay: "0s" }}
          />
          <div
            className="racing-line"
            style={{ top: "35%", animationDelay: "1.5s" }}
          />
          <div
            className="racing-line"
            style={{ top: "55%", animationDelay: "3s" }}
          />
          <div
            className="racing-line"
            style={{ top: "75%", animationDelay: "4.5s" }}
          />
        </div>

        {/* Tire marks pattern */}
        <div className="tire-marks opacity-30" />

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-red-500/5 to-transparent animate-pulse" />

        {/* Dynamic floating elements */}
        <motion.div
          className="absolute top-20 left-10 w-3 h-3 bg-red-500/30 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-2 h-2 bg-red-500/40 rounded-full"
          animate={{
            y: [0, -30, 0],
            x: [0, 10, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-4 h-4 bg-red-500/25 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.25, 0.6, 0.25],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

      {/* Premium Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-20 bg-white/70 backdrop-blur-xl border-b border-gray-100 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-bold text-gray-900 hover:text-red-600 transition-all duration-300 hover:drop-shadow-lg"
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
          </motion.div>
          <div className="hidden md:flex items-center space-x-8">
            <motion.div className="relative group">
              <Link
                href="/#models"
                className="text-gray-700 hover:text-red-600 transition-colors font-medium py-2 px-1"
              >
                All Models
              </Link>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <motion.div className="relative group">
              <Link
                href="/#models"
                className="text-gray-700 hover:text-red-600 transition-colors font-medium py-2 px-1"
              >
                Compare Models
              </Link>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <motion.div className="relative group">
              <Link
                href="/#about"
                className="text-gray-700 hover:text-red-600 transition-colors font-medium py-2 px-1"
              >
                About
              </Link>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCartFn}
              className="relative hover:text-red-600 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartState.itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center p-0">
                  {cartState.itemCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Mobile Navigation */}
          <MobileNavigation />
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 max-w-5xl"
        >
          <h1 className="mb-6 font-bold tracking-tight text-4xl md:text-6xl lg:text-7xl text-gray-900">
            <motion.span
              className="block bg-gradient-to-r from-gray-900 via-red-600 to-gray-900 bg-clip-text text-transparent"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {typedText}
            </motion.span>
            {!isTypingComplete && (
              <motion.span
                className="ml-1 inline-block h-12 w-1 bg-red-600"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <p className="max-w-3xl text-xl leading-relaxed text-gray-600">
            {subheadline}
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="mb-16 flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              size="lg"
              className="btn-premium bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <Link href="/#models">{primaryCTA}</Link>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              size="lg"
              variant="outline"
              className="btn-premium border-2 border-gray-300 hover:border-red-600 hover:text-red-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all"
              style={{ color: "var(--text-primary)" }}
              asChild
            >
              <Link href="/#models">{secondaryCTA}</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mb-12"
        >
          <div className="ultra-glass rounded-2xl p-8 shadow-lg border border-gray-100 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-red-50 p-3 rounded-full mb-3">
                  <Star className="h-6 w-6 text-red-600" fill="currentColor" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{rating}</div>
                <div className="text-sm text-gray-600">
                  ⭐️ {reviewCount.toLocaleString()}+ Happy Customers Worldwide
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="bg-red-50 p-3 rounded-full mb-3">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-lg font-bold text-gray-900">2-Year</div>
                <div className="text-sm text-gray-600">Warranty</div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="bg-red-50 p-3 rounded-full mb-3">
                  <Truck className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-lg font-bold text-gray-900">Free</div>
                <div className="text-sm text-gray-600">Shipping</div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="bg-red-50 p-3 rounded-full mb-3">
                  <Award className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-lg font-bold text-gray-900">Premium</div>
                <div className="text-sm text-gray-600">Quality</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg border border-gray-100">
            <ChevronDown className="h-6 w-6 text-gray-600" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
