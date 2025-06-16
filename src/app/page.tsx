import React from "react";
import HeroSection from "@/components/HeroSection";
import ProductComparisonGrid from "@/components/ProductComparisonGrid";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import VideoShowcase from "@/components/VideoShowcase";
import InteractiveFAQ from "@/components/InteractiveFAQ";
import TestProduct from "@/components/TestProduct";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Truck, Award, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <section
        id="about"
        className="w-full py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-center">
            Why <span className="text-red-600">TurboKart</span>?
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12 text-lg">
            We combine cutting-edge engineering with premium materials to create
            the most exhilarating go-kart experience on the market.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-red-300 transition-all shadow-sm hover:shadow-lg">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Unmatched Performance
              </h3>
              <p className="text-gray-600">
                Our proprietary motor technology delivers up to 25mph with
                precision handling that puts you in complete control.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-red-300 transition-all shadow-sm hover:shadow-lg">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Built to Last
              </h3>
              <p className="text-gray-600">
                Aircraft-grade aluminum frame, reinforced axles, and premium
                components ensure years of thrilling rides.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-red-300 transition-all shadow-sm hover:shadow-lg">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Fully Customizable
              </h3>
              <p className="text-gray-600">
                Express your style with custom colors, premium tires, LED
                lighting, and performance upgrades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Warranty Badge Section */}
      <section className="w-full py-12 px-4 md:px-8 bg-gradient-to-r from-red-50 via-white to-red-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Premium Protection & Service
            </h3>
            <p className="text-gray-600">
              Industry-leading warranty and support for your peace of mind
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-lg transition-all">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-gray-900 font-bold text-lg mb-2">
                30-Day Guarantee
              </h4>
              <p className="text-gray-600 text-sm">
                Complete money-back promise if you're not 100% satisfied
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-lg transition-all">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-gray-900 font-bold text-lg mb-2">
                Crypto Secure
              </h4>
              <p className="text-gray-600 text-sm">
                Safe & secure cryptocurrency payments via Coinbase Commerce
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-lg transition-all">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="text-gray-900 font-bold text-lg mb-2">
                Race-Ready Build
              </h4>
              <p className="text-gray-600 text-sm">
                Pre-assembled and tested for immediate racing action
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Comparison Section */}
      <section className="w-full py-20 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 text-center">
            Meet the Fleet
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12 text-lg">
            Compare our premium models and find your perfect ride
          </p>

          <ProductComparisonGrid />

          <div className="mt-12 text-center">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-xl font-semibold"
            >
              View All Specifications <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <VideoShowcase />

      {/* Reviews Section */}
      <ReviewsCarousel />

      {/* FAQ Section */}
      <InteractiveFAQ />

      {/* CTA Section */}
      <section
        id="customize"
        className="w-full py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-r from-red-600 to-red-700"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Experience the Thrill?
          </h2>
          <p className="text-white/90 max-w-3xl mx-auto mb-8 text-lg">
            Join the elite community of TurboKart riders and transform your
            weekends forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-red-600 hover:bg-white/90 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <Link href="/#models">Shop All Models</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold rounded-xl transition-all"
              asChild
            >
              <Link href="/#models">Configure Your Kart</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Test Product Section - Admin Only */}
      {/* Test Product Section - Development Only */}
      {process.env.NODE_ENV === "development" && (
        <section className="w-full py-16 px-4 md:px-8 lg:px-16 bg-blue-50 border-t border-blue-200">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              🧪 Test Product - Payment Verification
            </h2>
            <p className="text-blue-700 mb-8">
              Use this $1 test product to verify the complete Coinbase Commerce
              checkout flow.
            </p>
            <TestProduct />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer
        id="contact"
        className="w-full py-12 px-4 md:px-8 lg:px-16 bg-gray-900"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/turbokart-logo.png"
                alt="TurboKart Logo"
                className="h-8 w-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <h3 className="text-xl font-bold text-white">TurboKart</h3>
            </div>
            <p className="text-zinc-400 mb-4">
              The ultimate premium go-kart experience for thrill-seekers and
              performance enthusiasts.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#models"
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  All Models
                </Link>
              </li>
              <li>
                <Link
                  href="/products/nighthawk"
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Nighthawk
                </Link>
              </li>
              <li>
                <Link
                  href="/products/trackhawk"
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Trackhawk
                </Link>
              </li>
              <li>
                <Link
                  href="/products/viper-x"
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Viper X
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#about"
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/#models"
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Compare Models
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-800 text-center">
          <p className="text-zinc-500">
            © {new Date().getFullYear()} TurboKart. All rights reserved. |
            Secure Crypto Payments via Coinbase Commerce
          </p>
        </div>
      </footer>
    </main>
  );
}
