"use client";

import { useEffect, useRef } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollAnimation(
  className: string = "in-view",
  options: UseScrollAnimationOptions = {},
) {
  const elementRef = useRef<HTMLElement>(null);
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(className);
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            entry.target.classList.remove(className);
          }
        });
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [className, threshold, rootMargin, triggerOnce]);

  return elementRef;
}

export function useStaggeredScrollAnimation(
  selector: string,
  className: string = "in-view",
  staggerDelay: number = 100,
) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll(selector);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(elements).indexOf(entry.target as Element);
            setTimeout(() => {
              entry.target.classList.add(className);
            }, index * staggerDelay);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px",
      },
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      elements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, [selector, className, staggerDelay]);

  return containerRef;
}
