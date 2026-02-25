import { Heart } from "lucide-react";

export default function ShareLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-rose-100/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span className="font-script text-xl font-semibold tracking-tight text-foreground">
                Wedding Planner
              </span>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-rose-50 text-xs font-medium text-rose-600">
              Shared Timeline
            </span>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </>
  );
}
