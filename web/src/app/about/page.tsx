"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import heroImage from "@/assets/hero-dining-room.png"
import { Playfair_Display } from "next/font/google"
import Loading from "@/components/loading"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const values = [
  {
    title: "Sourced with Care",
    desc: "We work directly with local farms, butchers, and fishmongers across Mindanao to bring you ingredients that are honestly sourced and simply prepared.",
  },
  {
    title: "Cooked Over Fire",
    desc: "Every plate passes through our open wood-fired kitchen. No shortcuts, no heat lamps — just live fire, cast iron, and a chef who's watching it.",
  },
  {
    title: "A Room Built to Linger",
    desc: "Maison Plate isn't just a dining room — it's reclaimed steel, aged oak, and low light built for long dinners and slow conversation.",
  },
]

const About = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800) // adjust or remove if not needed

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    // `dark` forced so this page stays the same blackened-steel/copper room
    // as the rest of the site, regardless of the theme toggle.
    <div className="dark min-h-screen bg-background text-foreground">

      {/* Hero */}
      <section className="relative h-[55vh] flex items-center justify-center overflow-hidden">

        {/* Image */}
        <Image
          src={heroImage}
          alt="Maison Plate dining room"
          fill
          priority
          className="object-cover scale-105"
        />

        {/* Overlay (dark + gradient fade bottom) */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />

        {/* Title */}
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center font-heading"
          >
            <p className="text-accent tracking-[0.3em] uppercase text-sm mb-3">
              Maison Plate
            </p>
            <h1 className={`${playfair.className} font-heading text-6xl font-bold`}>
              Our <span className="text-accent italic">Story</span>
            </h1>
          </motion.h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-28">
        <div className="max-w-3xl mx-auto text-center px-6">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* EST */}
            <p className="text-accent tracking-[0.35em] uppercase text-xs mb-6">
              EST. 2018
            </p>

            {/* Title */}
            <h2 className={`${playfair.className} font-heading text-4xl md:text-5xl font-semibold mb-8`}>
              Built Around an Open Flame
            </h2>

            {/* Paragraph */}
            <p className="text-foreground/70 text-lg leading-relaxed mb-6">
              Maison Plate began with a simple belief: that food cooked over live fire, in a room built
              from honest materials, doesn&apos;t need much dressing up. What started as a single
              wood-fired hearth has grown into a full dining room — reclaimed steel beams, aged oak
              tables, and a kitchen you can watch from your seat.
            </p>

            <p className="text-foreground/70 text-lg leading-relaxed">
              Our founders wanted a place that felt more like a workshop than a restaurant — where the
              tools of the trade are part of the room, not hidden in the back. Today, Maison Plate is
              where regulars come for the fire as much as the food.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-5xl mx-auto px-6">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="text-accent tracking-[0.35em] uppercase text-xs mb-3">
              What Drives Us
            </p>

            <h2 className={`${playfair.className} font-heading text-4xl md:text-5xl font-bold`}>
              Our Values
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="bg-card rounded-sm p-8 border border-accent/30 text-center hover:border-accent/60 hover:shadow-lg hover:shadow-accent/20 transition"
              >
                <h3 className={`${playfair.className} font-heading text-2xl font-semibold text-foreground mb-3`}>
                  {v.title}
                </h3>

                <p className="text-foreground/60 text-sm leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}

export default About