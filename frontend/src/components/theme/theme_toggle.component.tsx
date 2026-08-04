import React, { useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme.context";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { flushSync } from "react-dom";

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const iconRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        {
          rotation: isDark ? -180 : 180,
          scale: 0.2,
          opacity: 0,
        },
        {
          rotation: 0,
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [isDark]);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => {
        ready: Promise<void>;
        finished: Promise<void>;
      };
    };
    
    // Check if the browser supports View Transitions API and user respects motion
    if (!doc.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      toggleTheme();
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const isDarkCurrent = isDark;
    
    // Add a class for scoping theme transition styles
    document.documentElement.classList.add("theme-transitioning");

    const transition = doc.startViewTransition(() => {
      flushSync(() => {
        toggleTheme();
      });
    });

    transition.ready.then(() => {
    .catch(err => console.error(err))