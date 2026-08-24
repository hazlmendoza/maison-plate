"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Playfair_Display } from "next/font/google"
import { Bell } from "lucide-react"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

interface Announcement {
  id: number
  title: string
  description: string
  badge: string
  type?: string
}

export default function Announcements() {
  const [posts, setPosts] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/announcements")
        const data = await res.json()
        setPosts(data || [])
      } catch (err) {
        console.error("Failed to fetch announcements", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    // `dark` forced so this section stays the same blackened-steel room
    // as the rest of the page, regardless of the site-wide theme toggle.
    <section className="dark py-24 bg-background border-t border-accent/10 text-foreground overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-accent tracking-[0.3em] uppercase text-sm mb-3">
            What&apos;s Happening
          </p>
          <h2
            className={`${playfair.className} text-4xl md:text-5xl font-bold`}
          >
            News & <span className="text-accent italic">Promos</span>
          </h2>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="max-w-3xl mx-auto space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-sm border border-foreground/10 p-5 bg-foreground/5"
              >
                <div className="h-4 w-1/4 bg-foreground/10 rounded mb-2" />
                <div className="h-5 w-3/4 bg-foreground/10 rounded mb-2" />
                <div className="h-4 w-full bg-foreground/10 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Posts */}
        {!loading && posts.length > 0 && (
          <>
            <div className="max-w-xl mx-auto space-y-4">
              {posts.slice(0, 3).map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-sm border border-foreground/10 p-5 hover:shadow-lg hover:shadow-accent/20 transition"
                >
                  <div className="flex items-center gap-3 mb-1">
                    {/* Badge */}
                    <span className="text-sm font-semibold px-2.5 py-0.5 rounded-sm bg-accent/20 text-accent">
                      {item.badge ?? "Update"}
                    </span>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-foreground">
                      {item.title}
                    </h3>
                  </div>

                  {/* Excerpt */}
                  <p className="text-foreground/70 text-md">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* View All Button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-10"
            >
              <Link
                href="/announcements"
                className="inline-block rounded-sm border border-accent px-8 py-3 font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground"
              >
                View All
              </Link>
            </motion.div>
          </>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
              <Bell className="w-8 h-8 text-accent" />
            </div>

            <h3 className={`${playfair.className} text-2xl font-semibold mb-2`}>
              No Announcement Yet
            </h3>

            <p className="text-foreground/60 max-w-md">
              Our latest announcements will appear here soon.
              <br />
              Stay tuned for updates!
            </p>

            <div className="mt-6 h-[1px] w-24 bg-accent/30" />
          </div>
        )}
      </div>
    </section>
  )
}
