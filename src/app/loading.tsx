import { Heart } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="text-center">
        <Heart className="w-8 h-8 text-rose-400 mx-auto mb-3 animate-pulse" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
