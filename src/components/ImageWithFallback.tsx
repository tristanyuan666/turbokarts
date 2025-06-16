"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
}

export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  className,
  fill,
  width,
  height,
  priority,
  sizes,
  style,
  onLoad,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setHasError(false);
    if (onLoad) {
      onLoad();
    }
  };

  useEffect(() => {
    const imgElement = imgRef.current;
    if (imgElement) {
      imgElement.addEventListener("error", handleError);
      imgElement.addEventListener("load", handleLoad);

      return () => {
        imgElement.removeEventListener("error", handleError);
        imgElement.removeEventListener("load", handleLoad);
      };
    }
  }, [imgSrc]);

  const imageProps: any = {
    ref: imgRef,
    src: imgSrc,
    alt,
    className,
    style,
  };

  if (fill) {
    imageProps.fill = true;
    if (sizes) imageProps.sizes = sizes;
  } else {
    if (width) imageProps.width = width;
    if (height) imageProps.height = height;
  }

  if (priority) {
    imageProps.priority = true;
  }

  return <Image {...imageProps} />;
}
