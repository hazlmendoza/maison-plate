"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

export default function Loading() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!loading) return null

  return (
    // `dark` forced so the loader stays the same blackened-steel/copper
    // look as the rest of the site, regardless of the theme toggle.
    <div className="dark fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Background glow */}
      <div className="absolute w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" />
      <div className="relative flex flex-col items-center">
        {/* Open-flame mark */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-28 h-28 flex items-end justify-center">
            {/* Hearth base */}
            <div className="relative w-20 h-6 bg-[var(--chart-3)] rounded-sm shadow-xl" />

            {/* Flame */}
            <div className="absolute bottom-5 w-10 h-16 animate-flicker">
              <div className="absolute inset-0 bg-accent rounded-[50%_50%_50%_50%/60%_60%_40%_40%]" />
              <div className="absolute inset-x-[22%] bottom-0 top-[30%] bg-[oklch(0.7_0.16_55)] rounded-[50%_50%_50%_50%/60%_60%_40%_40%]" />
            </div>

            {/* Embers */}
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="absolute top-0 w-1 h-10 bg-accent/70 rounded-full blur-sm animate-ember"
                style={{
                  left: `${40 + i * 10}%`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            ))}
          </div>
        </div>
        {/* Brand */}
        <h1
          className={`${playfair.className} text-4xl font-semibold text-foreground tracking-wide`}
        >
          Maison Plate
        </h1>
        <p className="text-accent text-lg tracking-[0.4em] mt-1">
          WOOD FIRE · STEEL · TABLE
        </p>
        {/* Loading text */}
        <p className="text-foreground/50 text-md mt-4 tracking-widest">
          Setting the table...
        </p>
      </div>
      {/* Animations */}
      <style>{`
        @keyframes flicker {
          0%, 100% { transform: scaleY(1) scaleX(1); }
          25% { transform: scaleY(1.08) scaleX(0.94); }
          50% { transform: scaleY(0.92) scaleX(1.05); }
          75% { transform: scaleY(1.05) scaleX(0.97); }
        }
        .animate-flicker {
          animation: flicker 1.4s ease-in-out infinite;
          transform-origin: bottom center;
        }
        @keyframes ember {
          0% {
            transform: translateY(10px) scaleX(1);
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-30px) scaleX(1.5);
            opacity: 0;
          }
        }
        .animate-ember {
          animation: ember 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
