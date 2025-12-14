import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "@/components/LightRays";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev Event",
  description:
    "A modern Next.js web application designed to showcase developer events, tech workshops, and coding meetups. Explore upcoming events, connect with the developer community, and stay updated with the latest tech trends in an interactive and user-friendly platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${schibstedGrotesk.variable} ${martianMono.variable} min-h-screen antialiased`}
      >
        <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
          <LightRays
            raysOrigin="top-center-offset"
            raysColor="#5dfeca"
            raysSpeed={0.5}
            lightSpread={1.2}
            rayLength={1.8}
            followMouse={true}
            mouseInfluence={0.02}
            noiseAmount={0.0}
            distortion={0.01}
          />

          {/* <LightRays
            raysOrigin="top-center-offset"
            raysColor={["#5dfeca", "#33a1fd", "#ff7eb9"]}
            raysSpeed={0.6}
            lightSpread={1.2}
            rayLength={1.8}
            followMouse={true}
            mouseInfluence={0.04}
            noiseAmount={0.02}
            distortion={0.02}
          /> */}
        </div>

        <main>{children}</main>
      </body>
    </html>
  );
}
