"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ShoppingCart,
  Home,
  Grid3X3,
  Info,
  Phone,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

interface MobileNavigationProps {
  className?: string;
}

export default function MobileNavigation({
  className = "",
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { state, toggleCart } = useCart();

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { href: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    {
      href: "/#models",
      label: "All Models",
      icon: <Grid3X3 className="h-5 w-5" />,
    },
    { href: "/#about", label: "About", icon: <Info className="h-5 w-5" /> },
    {
      href: "/#contact",
      label: "Contact",
      icon: <Phone className="h-5 w-5" />,
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className={`md:hidden ${className}`}>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCart}
            className="relative hover:text-red-600 transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            {state.itemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center p-0">
                {state.itemCount}
              </Badge>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="hover:text-red-600 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
              onClick={toggleMenu}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 z-50 overflow-hidden shadow-2xl md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <Link
                    href="/"
                    className="text-2xl font-bold text-gray-900"
                    onClick={toggleMenu}
                  >
                    TurboKart
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMenu}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto p-6">
                  <nav className="space-y-2">
                    {menuItems.map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                      >
                        <Link
                          href={item.href}
                          onClick={toggleMenu}
                          className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <div className="text-gray-500 group-hover:text-red-600 transition-colors">
                            {item.icon}
                          </div>
                          <span className="text-lg font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                            {item.label}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </nav>

                  {/* Featured Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      🏎️ New Models Available
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Check out our latest high-performance go-karts with
                      advanced features.
                    </p>
                    <Link
                      href="/#models"
                      onClick={toggleMenu}
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Explore Models
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        →
                      </motion.div>
                    </Link>
                  </motion.div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-500">
                      ✅ Free shipping • 🔄 30-day returns • 🛡️ 2-year warranty
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sticky Bottom CTA (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <div className="flex gap-3">
          <Button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl"
            asChild
          >
            <Link href="/#models">🏎️ Build Yours</Link>
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-2 border-gray-300 hover:border-red-600 hover:text-red-600 font-semibold py-3 rounded-xl"
            asChild
          >
            <Link href="/#models">Compare Models</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
