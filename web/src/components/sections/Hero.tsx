"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import heroImage from "@/assets/hero-dining-room.png"
import { Button } from "@/components/ui/button"
import { Playfair_Display, Great_Vibes } from "next/font/google"

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

export default function HeroSection() {
  return (
    <section className="dark relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="Maison Plate dining room — reclaimed steel, oak tables, open kitchen"
          fill
          priority
          sizes="100vw"
          className="object-cover scale-105 brightness-[0.5]"
        />
      </div>

      {/* Steel scrim */}
      <div className="absolute inset-0 z-10 bg-background/70" />

      {/* Ember drift */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 100, opacity: 0 }}
            animate={{
              y: -800,
              opacity: [0.5, 0.1, 0.5],
              x: [0, 20, -20, 0],
            }}
            transition={{
              duration: 6 + i * 1.5,
              repeat: Infinity,
              delay: i * 1,
              ease: "easeInOut",
            }}
            className="absolute bottom-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl"
            style={{
              left: `${10 + i * 15}%`,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 100, opacity: 0 }}
            animate={{
              y: -500,
              opacity: [0.5, 0.1, 0.5],
              x: [0, 20, 50, 0],
            }}
            transition={{
              duration: 6 + i * 1.5,
              repeat: Infinity,
              delay: i * 1,
              ease: "easeInOut",
            }}
            className="absolute bottom-0 w-32 h-32 bg-foreground/10 rounded-full blur-2xl"
            style={{
              left: `${10 + i * 15}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto text-center px-4">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-accent font-medium tracking-[0.35em] uppercase text-xs md:text-sm mb-6"
        >
          WOOD FIRE · STEEL · TABLE
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className={`${playfair.className} text-5xl md:text-6xl lg:text-8xl font-bold leading-tight mb-6 text-foreground`}
        >
          Every Plate
          <br />
          <span className="text-accent italic font-semibold">
            Tells Its Origin
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-foreground/70 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Wood-fired mains and cellar-aged wine, served in a room built from
          reclaimed steel and oak. Maison Plate — honest food, no shortcuts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/menu">
            <Button className="rounded-sm px-12 py-6 bg-accent hover:bg-accent/85 text-accent-foreground font-semibold transition">
              View the Menu
            </Button>
          </Link>

          <Link href="/reservations">
            <Button
              variant="outline"
              className="rounded-sm px-12 py-6 border border-accent/60 text-foreground hover:bg-foreground/10 bg-transparent transition"
            >
              Reserve a Table
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
