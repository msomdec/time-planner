export const WEDDING_COLORS = [
  { name: "Blush", hex: "#f9a8d4" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Champagne", hex: "#f5e6cc" },
  { name: "Gold", hex: "#d4a574" },
  { name: "Sage", hex: "#a3b18a" },
  { name: "Lavender", hex: "#c4b5e0" },
  { name: "Dusty Blue", hex: "#8eafc2" },
  { name: "Mauve", hex: "#c9a0b5" },
  { name: "Terracotta", hex: "#c67d5b" },
  { name: "Ivory", hex: "#f5f0e8" },
  { name: "Peach", hex: "#f7c5a8" },
  { name: "Burgundy", hex: "#8b2252" },
] as const;

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "text/plain": [".txt"],
};
