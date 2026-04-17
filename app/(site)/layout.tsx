import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { VideoBackground } from "@/components/ui/VideoBackground";
import { MagicChat } from "@/components/ui/MagicChat";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-1 flex-col">
      <VideoBackground />
      <Nav />
      <main className="relative flex-1">{children}</main>
      <Footer />
      <MagicChat />
    </div>
  );
}
