"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Playfair_Display } from "next/font/google"

export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

export default function CTASection() {
  return (
    // `dark` forced so this section stays the same blackened-steel room
    // as the rest of the page, regardless of the site-wide theme toggle.
    <section className="dark py-24 bg-background border-t border-accent/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-accent tracking-[0.3em] uppercase text-sm mb-3">
            Reserve a Table
          </p>

          <h2
            className={`${playfair.className} text-foreground text-4xl md:text-5xl font-bold mb-6`}
          >
            Your Table <span className="text-accent italic">Awaits</span>
          </h2>

          <p className="text-foreground/60 text-lg leading-relaxed mb-10">
            Whether it&apos;s a long wood-fired lunch or an evening around the
            open kitchen with friends, reserve your spot and let us take care of
            the rest.
          </p>

          <Link
            href="/reservations"
            className="inline-block rounded-sm bg-accent px-10 py-4 font-semibold text-accent-foreground hover:bg-accent/85 transition text-lg"
          >
            Book Your Table
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
