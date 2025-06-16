"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Package, Truck, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CoinbaseCommerceService } from "@/lib/coinbase-commerce";

interface OrderInfo {
  orderNumber: string;
  chargeId: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  items: any[];
  total: number;
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "confirmed" | "failed"
  >("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrderInfo = () => {
      try {
        const storedOrder = localStorage.getItem("pendingOrder");
        if (storedOrder) {
          const order = JSON.parse(storedOrder);
          setOrderInfo(order);

          // Check payment status with Coinbase Commerce
          if (order.chargeId) {
            checkPaymentStatus(order.chargeId);
          }
        }
      } catch (error) {
        console.error("Error loading order info:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkPaymentStatus = async (chargeId: string) => {
      try {
        const charge = await CoinbaseCommerceService.getCharge(chargeId);

        // Check if payment is confirmed
        const hasConfirmedPayment =
          charge.payments &&
          charge.payments.some(
            (payment: any) => payment.status === "CONFIRMED",
          );

        if (hasConfirmedPayment) {
          setPaymentStatus("confirmed");
          // Clear the pending order from localStorage
          localStorage.removeItem("pendingOrder");
        } else {
          // Check timeline for completion
          const isCompleted =
            charge.timeline &&
            charge.timeline.some((event: any) => event.status === "COMPLETED");

          if (isCompleted) {
            setPaymentStatus("confirmed");
            localStorage.removeItem("pendingOrder");
          } else {
            setPaymentStatus("pending");
          }
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        setPaymentStatus("failed");
      }
    };

    loadOrderInfo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order information...</p>
        </div>
      </div>
    );
  }

  if (!orderInfo || !orderNumber) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Order Not Found</h1>
          <p className="text-gray-600">
            We couldn't find your order information.
          </p>
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getStatusInfo = () => {
    switch (paymentStatus) {
      case "confirmed":
        return {
          icon: <Check className="h-8 w-8 text-white" />,
          bgColor: "bg-green-600",
          title: "Payment Confirmed!",
          message:
            "Your cryptocurrency payment has been confirmed and your order is being processed.",
        };
      case "pending":
        return {
          icon: (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          ),
          bgColor: "bg-blue-600",
          title: "Payment Pending",
          message:
            "Your payment is being processed. This usually takes a few minutes for cryptocurrency transactions.",
        };
      case "failed":
        return {
          icon: <div className="h-8 w-8 text-white font-bold text-xl">!</div>,
          bgColor: "bg-red-600",
          title: "Payment Issue",
          message:
            "There was an issue with your payment. Please contact support if you believe this is an error.",
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            asChild
            className="text-gray-600 hover:text-gray-900"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Status Card */}
        <Card className="mb-8 text-center">
          <CardContent className="pt-8 pb-6">
            <div
              className={`w-16 h-16 ${statusInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              {statusInfo.icon}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {statusInfo.title}
            </h1>
            <p className="text-gray-600 mb-4">{statusInfo.message}</p>
            <div className="bg-gray-100 rounded-lg p-3 inline-block">
              <p className="text-sm text-gray-700">Order #{orderNumber}</p>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderInfo.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    {item.color} • {item.tires} • Qty: {item.quantity}
                  </p>
                  {item.addOns && item.addOns.length > 0 && (
                    <div className="mt-1">
                      {item.addOns.map((addOn: any, addOnIndex: number) => (
                        <p key={addOnIndex} className="text-xs text-gray-500">
                          + {addOn.name}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    $
                    {(item.price +
                      (item.addOns?.reduce(
                        (sum: number, addOn: any) => sum + addOn.price,
                        0,
                      ) || 0)) *
                      item.quantity}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-red-600">
                ${orderInfo.total}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">
                {orderInfo.customerInfo.firstName}{" "}
                {orderInfo.customerInfo.lastName}
              </p>
              <p className="text-gray-600">{orderInfo.customerInfo.address}</p>
              <p className="text-gray-600">
                {orderInfo.customerInfo.city}, {orderInfo.customerInfo.state}{" "}
                {orderInfo.customerInfo.zip}
              </p>
            </div>
            {paymentStatus === "confirmed" && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  📦 Your order will ship within 48 hours. Estimated delivery:
                  7-10 business days.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">
                  Order Confirmation Email
                </p>
                <p className="text-sm text-gray-600">
                  We've sent a confirmation email to{" "}
                  {orderInfo.customerInfo.email}
                </p>
              </div>
            </div>
            {paymentStatus === "confirmed" && (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Processing & Shipping
                    </p>
                    <p className="text-sm text-gray-600">
                      Your order will be processed and shipped within 48 hours
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Tracking Information
                    </p>
                    <p className="text-sm text-gray-600">
                      You'll receive tracking details once your order ships
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button asChild className="bg-red-600 hover:bg-red-700 mr-4">
            <Link href="/">Continue Shopping</Link>
          </Button>
          {paymentStatus === "pending" && (
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Refresh Status
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
