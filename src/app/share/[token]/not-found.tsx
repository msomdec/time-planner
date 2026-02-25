import { Heart } from "lucide-react";

export default function SharedTimelineNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Heart className="w-12 h-12 text-rose-200 mb-4" />
      <h2 className="font-script text-2xl font-bold text-foreground mb-2">
        Timeline Not Found
      </h2>
      <p className="text-muted-foreground text-sm max-w-md">
        This shared link is no longer valid. It may have been revoked or the
        timeline may have been deleted. Please ask the organizer for an updated
        link.
      </p>
    </div>
  );
}
