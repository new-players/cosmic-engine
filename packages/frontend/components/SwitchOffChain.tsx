"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { LinkIcon, CircleStackIcon } from "@heroicons/react/24/outline";

export const SwitchOffChain = ({ className }: { className?: string }) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isDarkMode = resolvedTheme === "dark";

  const handleToggle = () => {
    if (isDarkMode) {
    //   setTheme("light");
      return;
    }
    //setTheme("dark");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`flex space-x-2 h-8 items-center justify-center text-sm ${className}`}>
      <input
        id="theme-toggle"
        type="checkbox"
        className="toggle toggle-primary bg-primary hover:bg-primary border-primary"
      />
      <label htmlFor="theme-toggle" className={`swap swap-rotate ${!isDarkMode ? "swap-active" : ""}`}>
        <CircleStackIcon className="swap-on h-5 w-5" />
        <LinkIcon className="swap-off h-5 w-5" />
        Toggle Theme
      </label>
    </div>
  );
};
