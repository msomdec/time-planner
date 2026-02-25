"use client";

import { WEDDING_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {WEDDING_COLORS.map((color) => (
        <button
          key={color.hex}
          type="button"
          onClick={() => onChange(color.hex)}
          className={cn(
            "w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center",
            value === color.hex
              ? "border-foreground scale-110"
              : "border-transparent hover:scale-105"
          )}
          style={{ backgroundColor: color.hex }}
          title={color.name}
        >
          {value === color.hex && (
            <Check
              className="w-4 h-4"
              style={{
                color: isLightColor(color.hex) ? "#333" : "#fff",
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}
