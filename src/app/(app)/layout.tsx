import { Navbar } from "@/components/layout/navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </>
  );
}
