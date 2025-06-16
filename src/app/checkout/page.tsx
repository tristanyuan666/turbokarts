"use client";

import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  Truck,
  Shield,
  ArrowLeft,
  Bitcoin,
  Wallet,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = [
      "firstName",
      "lastName",
      "email",
      "address",
      "city",
      "state",
      "zip",
    ];
    return required.every(
      (field) => customerInfo[field as keyof typeof customerInfo].trim() !== "",
    );
  };

  const handleCoinbasePayment = async () => {
    if (!validateForm()) {
      setPaymentError("Please fill in all required fields");
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      const orderNum = `TK${Date.now().toString().slice(-6)}`;

      const chargeData = {
        name: `TurboKart Order #${orderNum}`,
        description: `Premium Go-Kart Purchase - ${state.items.length} item(s)`,
        pricing_type: "fixed_price",
        local_price: {
          amount: state.total.toString(),
          currency: "USD",
        },
        metadata: {
          order_id: orderNum,
          customer_email: customerInfo.email,
          customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          items: state.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            color: item.color,
            tires: item.tires,
            addOns: item.addOns,
          })),
        },
        redirect_url: `${window.location.origin}/checkout/success?order=${orderNum}`,
        cancel_url: `${window.location.origin}/checkout`,
      };

      // Call the API route instead of the service directly
      const response = await fetch("/api/checkout/create-charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chargeData),
      });

      if (!response.ok) {
        throw new Error("Failed to create charge");
      }

      const { charge } = await response.json();

      // Store order info in localStorage for success page
      localStorage.setItem(
        "pendingOrder",
        JSON.stringify({
          orderNumber: orderNum,
          chargeId: charge.id,
          customerInfo,
          items: state.items,
          total: state.total,
        }),
      );

      // Redirect to Coinbase Commerce hosted checkout
      window.location.href = charge.hosted_url;
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError("Failed to initialize payment. Please try again.");
      setIsProcessingPayment(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order #{orderNumber} has been
            confirmed and will ship within 48 hours.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Estimated delivery: 7-10 business days
            </p>
            <p className="text-sm text-gray-600">
              Tracking information will be sent to your email
            </p>
          </div>
          <Button asChild className="w-full bg-red-600 hover:bg-red-700">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-gray-600">
            Add some items to your cart to proceed with checkout
          </p>
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            asChild
            className="text-gray-600 hover:text-gray-900"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Shopping
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Checkout</h1>

            <Card className="bg-white border-gray-200 mb-6 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {state.items.map((item) => {
                  const addOnTotal = item.addOns.reduce(
                    (sum, addOn) => sum + addOn.price,
                    0,
                  );
                  const itemTotal = (item.price + addOnTotal) * item.quantity;

                  return (
                    <div key={item.id} className="flex space-x-4">
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
                        <p className="text-sm text-gray-600">
                          {item.color} • {item.tires} • Qty: {item.quantity}
                        </p>

                        {item.addOns.length > 0 && (
                          <div className="mt-1">
                            {item.addOns.map((addOn, index) => (
                              <p key={index} className="text-xs text-gray-500">
                                + {addOn.name}
                              </p>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-between items-center mt-2">
                          <span className="text-gray-900 font-semibold">
                            ${itemTotal}
                          </span>
                          {item.originalPrice > item.price && (
                            <span className="text-xs text-gray-500 line-through">
                              $
                              {(item.originalPrice + addOnTotal) *
                                item.quantity}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <Separator className="bg-gray-200" />

                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>${state.total}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-red-600">${state.total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Shield className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-xs text-gray-700 font-medium">
                  2-Year Warranty
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Truck className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-xs text-gray-700 font-medium">
                  Free Shipping
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Check className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-xs text-gray-700 font-medium">
                  30-Day Returns
                </p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Bitcoin className="h-5 w-5 text-orange-500" />
                  Crypto Payments via Coinbase Commerce
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Secure, fast cryptocurrency payments powered by Coinbase
                  Commerce.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Crypto Payment Info */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Bitcoin className="h-6 w-6 text-orange-500" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Accepted Cryptocurrencies
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Bitcoin (BTC)
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Ethereum (ETH)
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      USD Coin (USDC)
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      And more...
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Shipping Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1 font-medium">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="w-full p-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1 font-medium">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className="w-full p-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1 font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full p-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1 font-medium">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className="w-full p-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="123 Main St"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1 font-medium">
                        City *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        className="w-full p-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1 font-medium">
                        State *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                        className="w-full p-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="NY"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1 font-medium">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.zip}
                        onChange={(e) =>
                          handleInputChange("zip", e.target.value)
                        }
                        className="w-full p-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="10001"
                        required
                      />
                    </div>
                  </div>
                </div>

                {paymentError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm">{paymentError}</p>
                  </div>
                )}

                <Button
                  onClick={handleCoinbasePayment}
                  disabled={isProcessingPayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wallet className="h-5 w-5" />
                      Pay with Cryptocurrency - ${state.total}
                      <ExternalLink className="h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-xs text-gray-500">
                    Powered by Coinbase Commerce - Secure cryptocurrency
                    payments
                  </p>
                  <p className="text-xs text-gray-500">
                    By placing your order, you agree to our Terms of Service and
                    Privacy Policy.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
