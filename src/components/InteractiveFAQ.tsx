"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
  Zap,
  Shield,
  Truck,
  Wrench,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  icon: React.ReactNode;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "How fast do TurboKart go-karts go?",
    answer:
      "Our go-karts range from 25 mph (Nighthawk) to 45 mph (Viper X). Each model is designed for different skill levels and age groups, ensuring both safety and excitement.",
    icon: <Zap className="h-5 w-5 text-red-500" />,
    category: "Performance",
  },
  {
    id: 2,
    question: "What's included with my go-kart purchase?",
    answer:
      "Every TurboKart includes the go-kart, charging equipment, user manual, assembly tools, and a 2-year comprehensive warranty. Free shipping is included worldwide.",
    icon: <Shield className="h-5 w-5 text-green-500" />,
    category: "Purchase",
  },
  {
    id: 3,
    question: "How long does shipping take?",
    answer:
      "We ship within 48 hours of order confirmation. Delivery typically takes 7-10 business days worldwide. You'll receive tracking information once your order ships.",
    icon: <Truck className="h-5 w-5 text-blue-500" />,
    category: "Shipping",
  },
  {
    id: 4,
    question: "Is assembly required?",
    answer:
      "Minimal assembly is required - typically 30-45 minutes with the included tools and clear instructions. Most customers find it straightforward and enjoyable.",
    icon: <Wrench className="h-5 w-5 text-orange-500" />,
    category: "Assembly",
  },
  {
    id: 5,
    question: "What age groups are these suitable for?",
    answer:
      "Nighthawk: 12+, Trackhawk: 14+, Viper X: 16+. Each model has specific weight limits and safety features designed for their target age group.",
    icon: <HelpCircle className="h-5 w-5 text-purple-500" />,
    category: "Safety",
  },
  {
    id: 6,
    question: "What's your warranty and return policy?",
    answer:
      "We offer a comprehensive 2-year warranty covering manufacturing defects and mechanical failures, plus a 30-day money-back guarantee if you're not completely satisfied.",
    icon: <Shield className="h-5 w-5 text-green-500" />,
    category: "Warranty",
  },
];

interface InteractiveFAQProps {
  title?: string;
  subtitle?: string;
}

export default function InteractiveFAQ({
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know about TurboKart go-karts",
}: InteractiveFAQProps) {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const categories = Array.from(new Set(faqData.map((item) => item.category)));

  const filteredFAQs = selectedCategory
    ? faqData.filter((item) => item.category === selectedCategory)
    : faqData;

  return (
    <section className="w-full py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === null
                ? "bg-red-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            All Questions
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-red-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            {filteredFAQs.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mb-4"
              >
                <Card className="bg-white border border-gray-200 hover:border-red-300 transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">{item.icon}</div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.question}
                        </h3>
                      </div>
                      <motion.div
                        animate={{
                          rotate: openItems.includes(item.id) ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {openItems.includes(item.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-0">
                            <div className="pl-9 border-l-2 border-gray-100">
                              <p className="text-gray-600 leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-4">
              Our team is here to help you find the perfect go-kart for your
              needs.
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
