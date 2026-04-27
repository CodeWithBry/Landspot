"use client";
import { useEffect, useRef, useState } from "react";

type AnimationContainerType = {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number; // delay in ms
};

export default function AnimationContainer({
  children,
  className = "",
  threshold = 0.2,
  triggerOnce = true,
  delay = 0,
}: AnimationContainerType) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, triggerOnce]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`
        transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        ${className}
      `}
    >
      {children}
    </div>
  );
}