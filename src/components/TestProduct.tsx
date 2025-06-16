"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ShoppingCart, TestTube } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";

export default function TestProduct() {
  const { addItem, openCart } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: "test-kart-1",
      name: "Test Kart",
      price: 1,
      originalPrice: 2,
      image:
        "https://images.unsplash.com/photo-1600706432502-77a0e2e31c7d?w=800&q=80",
      color: "Test Red",
      tires: "Test Grip",
      addOns: [],
    });
    // Immediately open cart drawer
    setTimeout(() => openCart(), 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <Card className="bg-white border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <div className="relative">
          <div className="h-48 relative overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1600706432502-77a0e2e31c7d?w=800&q=80"
              alt="Test Kart"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute top-4 right-4">
            <Badge className="bg-blue-600 text-white animate-pulse">
              TEST PRODUCT
            </Badge>
          </div>
        </div>

        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <TestTube className="h-5 w-5 text-blue-600" />
            Test Kart - $1
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-gray-600 mb-4">
            This is a $1 test product to verify the Coinbase Commerce payment
            flow. Perfect for testing the complete checkout process.
          </p>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Price:</span>
              <span className="font-semibold text-green-600">$1.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Original:</span>
              <span className="text-gray-400 line-through">$2.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Savings:</span>
              <span className="font-semibold text-red-600">50% OFF</span>
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 font-semibold"
          >
            <ShoppingCart size={16} />
            Test Add to Cart - $1
          </Button>

          <p className="text-xs text-gray-500 text-center mt-3">
            ⚠️ This is a test product for payment verification only
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
