"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Play,
  Filter,
  ChevronLeft,
  ChevronRight,
  Verified,
} from "lucide-react";

interface Review {
  id: number;
  name: string;
  location: string;
  date: string;
  rating: number;
  text: string;
  avatar: string;
  verified: boolean;
  helpful: number;
  model: string;
  videoUrl?: string;
  images?: string[];
  purchaseDate: string;
  expandedText?: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Marcus Rodriguez",
    location: "Los Angeles, CA",
    date: "March 15, 2024",
    rating: 5,
    text: "My 16-year-old son hasn't stopped riding his Viper X since his birthday. The build quality is incredible and it looks just like a real race car!",
    expandedText:
      "My 16-year-old son hasn't stopped riding his Viper X since his birthday. The build quality is incredible and it looks just like a real race car! I was skeptical about spending this much on a go-kart, but seeing his face light up every time he rides it makes it worth every penny. The LED underglow kit we added makes it look absolutely stunning at night. Customer service was exceptional when I had questions about safety features.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    verified: true,
    helpful: 47,
    model: "Viper X",
    purchaseDate: "September 2023",
    images: [
      "https://images.unsplash.com/photo-1600706432502-77a0e2e31c7d?w=400&q=80",
      "https://images.unsplash.com/photo-1600706432502-77a0e2e31c7d?w=400&q=80",
    ],
  },
  {
    id: 2,
    name: "Jennifer Kim",
    location: "Miami, FL",
    date: "April 3, 2024",
    rating: 5,
    text: "As a mom of three teenagers, the Trackhawk gives me peace of mind with its safety features while still delivering the thrill they crave.",
    expandedText:
      "As a mom of three teenagers, the Trackhawk gives me peace of mind with its safety features while still delivering the thrill they crave. The adjustable speed settings are perfect for different skill levels - my youngest can enjoy it safely while my oldest gets the full racing experience. Assembly was straightforward with clear instructions, and the battery life is amazing. We get solid 3+ hours of continuous fun!",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    verified: true,
    helpful: 32,
    model: "Trackhawk",
    purchaseDate: "January 2024",
    videoUrl: "https://example.com/video1",
  },
  {
    id: 3,
    name: "David Chen",
    location: "Austin, TX",
    date: "February 22, 2024",
    rating: 5,
    text: "The Nighthawk completely exceeded my expectations for an entry-level kart. My daughter loves the LED headlights and says it makes her feel like a real racer!",
    expandedText:
      "The Nighthawk completely exceeded my expectations for an entry-level kart. My daughter loves the LED headlights and says it makes her feel like a real racer! You won't find better value anywhere else - the style and performance are incredible for the price. The only thing I'd change is making the seat slightly more adjustable, but it's comfortable for extended rides. Great investment for family fun!",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    verified: true,
    helpful: 28,
    model: "Nighthawk",
    purchaseDate: "December 2023",
  },
  {
    id: 4,
    name: "Emma Rodriguez",
    location: "Chicago, IL",
    date: "May 10, 2024",
    rating: 5,
    text: "The customization options for the Viper X are incredible.",
    expandedText:
      "The customization options for the Viper X are incredible. I created a truly unique kart that performs as good as it looks. Customer service was excellent too. The carbon fiber accents and custom LED setup make it look like something from the future. Performance is absolutely insane - hits 45mph easily and handles like a dream.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    verified: true,
    helpful: 41,
    model: "Viper X",
    purchaseDate: "February 2024",
    images: [
      "https://images.unsplash.com/photo-1600706432502-77a0e2e31c7d?w=400&q=80",
    ],
  },
  {
    id: 5,
    name: "David Kim",
    location: "Seattle, WA",
    date: "January 8, 2024",
    rating: 5,
    text: "I've owned several go-karts before, but TurboKart is in a league of its own.",
    expandedText:
      "I've owned several go-karts before, but TurboKart is in a league of its own. The attention to detail and quality of materials is outstanding. The aluminum frame feels incredibly solid and the motor is whisper quiet yet powerful. Shipping was fast and everything arrived perfectly packaged. This is definitely a premium product.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    verified: true,
    helpful: 35,
    model: "Trackhawk",
    purchaseDate: "October 2023",
  },
  {
    id: 6,
    name: "Olivia Parker",
    location: "Denver, CO",
    date: "April 29, 2024",
    rating: 5,
    text: "The Trackhawk handles like a dream on all terrains.",
    expandedText:
      "The Trackhawk handles like a dream on all terrains. Shipping was fast and assembly was straightforward. Couldn't be happier with my purchase. We've taken it on grass, pavement, and even some light off-road trails. The suspension handles everything beautifully. My teenage son is obsessed with it and I don't blame him!",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    verified: true,
    helpful: 29,
    model: "Trackhawk",
    purchaseDate: "March 2024",
    videoUrl: "https://example.com/video2",
  },
];

interface ReviewsCarouselProps {
  autoScrollSpeed?: number; // in milliseconds
  pauseOnHover?: boolean;
}

export default function ReviewsCarousel({
  autoScrollSpeed = 3000,
  pauseOnHover = true,
}: ReviewsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedReview, setExpandedReview] = useState<number | null>(null);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterModel, setFilterModel] = useState<string | null>(null);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<number, number>>({});

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isPaused) {
      interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % reviews.length);
      }, autoScrollSpeed);
    }

    return () => clearInterval(interval);
  }, [isPaused, autoScrollSpeed]);

  const visibleReviews = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const index = (activeIndex + i) % reviews.length;
      result.push(reviews[index]);
    }
    return result;
  };

  return (
    <div className="w-full py-16 bg-white text-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            What Our Riders Say
          </h2>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-red-600 text-red-600" />
            ))}
          </div>
          <p className="text-lg text-gray-600">
            ⭐️ 4.9/5 based on 10,000+ Verified Customer Reviews
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          onMouseEnter={() => pauseOnHover && setIsPaused(true)}
          onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        >
          {visibleReviews().map((review) => (
            <Card
              key={review.id}
              className="bg-white border-gray-200 text-gray-900 overflow-hidden transition-all duration-300 hover:border-red-300 shadow-sm hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 border-2 border-red-500">
                    <AvatarImage src={review.avatar} alt={review.name} />
                    <AvatarFallback className="bg-red-500 text-white">
                      {review.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-500">{review.location}</p>
                  </div>
                </div>

                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? "fill-red-600 text-red-600" : "text-gray-500"}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    {review.date}
                  </span>
                </div>

                <p className="text-gray-600">"{review.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          {reviews.map((_, index) => (
            <button
              key={index}
              className={`mx-1 h-2 w-2 rounded-full ${index >= activeIndex && index < activeIndex + 3 ? "bg-red-500" : "bg-gray-300"}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to review set ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
