"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const { state, removeItem, updateQuantity, closeCart } = useCart();

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l border-gray-200 z-50 overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5 text-red-500" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Your Cart
                  </h2>
                  {state.itemCount > 0 && (
                    <Badge className="bg-red-600 text-white">
                      {state.itemCount}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeCart}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                {state.items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Your cart is empty</p>
                    <Button
                      onClick={closeCart}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                    >
                      Continue Shopping
                    </Button>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {state.items.map((item, index) => {
                        const addOnTotal = item.addOns.reduce(
                          (sum, addOn) => sum + addOn.price,
                          0,
                        );
                        const itemTotal =
                          (item.price + addOnTotal) * item.quantity;

                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                          >
                            <div className="flex space-x-4">
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>

                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">
                                  {item.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {item.color} • {item.tires}
                                </p>

                                {item.addOns.length > 0 && (
                                  <div className="mt-1">
                                    {item.addOns.map((addOn, index) => (
                                      <p
                                        key={index}
                                        className="text-xs text-gray-400"
                                      >
                                        + {addOn.name} (+${addOn.price})
                                      </p>
                                    ))}
                                  </div>
                                )}

                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 border-gray-300 hover:border-red-500 hover:text-red-600"
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          item.quantity - 1,
                                        )
                                      }
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="text-gray-900 font-medium w-8 text-center">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 border-gray-300 hover:border-red-500 hover:text-red-600"
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          item.quantity + 1,
                                        )
                                      }
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <div className="text-right">
                                      <p className="text-gray-900 font-semibold">
                                        ${itemTotal}
                                      </p>
                                      {item.originalPrice > item.price && (
                                        <p className="text-xs text-gray-400 line-through">
                                          $
                                          {(item.originalPrice + addOnTotal) *
                                            item.quantity}
                                        </p>
                                      )}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                      onClick={() => removeItem(item.id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer */}
              {state.items.length > 0 && (
                <motion.div
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  className="border-t border-gray-200 p-6 space-y-4 bg-white"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-red-600">
                      ${state.total}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                      asChild
                    >
                      <Link href="/checkout" onClick={closeCart}>
                        Proceed to Checkout
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-gray-300 text-gray-900 hover:border-red-600 hover:text-red-600 py-3 rounded-xl font-medium transition-all"
                      onClick={closeCart}
                    >
                      Continue Shopping
                    </Button>
                  </div>

                  <div className="text-center text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                    ✅ Free shipping • 🔄 30-day returns • 🛡️ 2-year warranty
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
