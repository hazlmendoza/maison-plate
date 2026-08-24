"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
})

const highlights = [
    {
        title: "Wood-Fired Kitchen",
        desc: "Seasonal mains cooked over open flame, plated with no shortcuts.",
        link: "/menu",
        cta: "See Menu",
    },
    {
        title: "Reserve Your Table",
        desc: "Secure a seat in the dining room for your next long lunch or evening service.",
        link: "/reservations",
        cta: "Book Now",
    },
]

export default function OfferSection() {
    return (
        // `dark` forced to match the hero — this section reads as the same
        // blackened-steel room, regardless of the site-wide theme toggle.
        <section className="dark py-24 bg-background">
            <div className="container mx-auto px-4">

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <p className="tracking-[0.3em] uppercase text-sm mb-3 text-accent">
                        What We Offer
                    </p>

                    <h2 className={`${playfair.className} text-4xl md:text-5xl font-bold text-foreground`}>
                        The Maison Plate <span className="text-accent italic">Experience</span>
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                    {highlights.map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="bg-card/60 backdrop-blur rounded-sm p-8 border border-accent/20 text-center flex flex-col hover:shadow-lg hover:shadow-accent/10 transition"
                        >
                            <h3 className={`${playfair.className} text-foreground text-2xl font-semibold mb-3`}>
                                {item.title}
                            </h3>

                            <p className="text-foreground/60 text-sm leading-relaxed mb-6 flex-1">
                                {item.desc}
                            </p>

                            <Link
                                href={item.link}
                                className="inline-block rounded-sm border border-accent px-6 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground"
                            >
                                {item.cta}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}