"use client";

import { useEffect } from "react";
import { applyTheme } from "@/lib/themes";

export default function ThemeInit() {
  useEffect(() => {
    applyTheme();
  }, []);

  return null;
}
