"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, X } from "lucide-react"
import { motion } from "framer-motion"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

interface Announcement {
  id: number
  title: string
  description?: string
  badge?: string
  type?: string
  is_active: boolean
  created_at: string
}

export default function AnnouncementPage() {
  const [posts, setPosts] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedPost, setSelectedPost] = useState<Announcement | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/announcements")
        if (!response.ok) throw new Error("Failed to fetch announcements")
        const data = await response.json()
        setPosts(Array.isArray(data) ? data : data.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  useEffect(() => {
    document.body.style.overflow = selectedPost ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [selectedPost])

  return (
    // `dark` forced so this page stays the same blackened-steel/copper room
    // as the rest of the site, regardless of the theme toggle.
    <div className="dark py-14 bg-background relative">
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="tracking-[0.3em] uppercase text-sm mb-3 text-accent">
            What&apos;s Happening
          </p>
          <h2
            className={`${playfair.className} text-4xl md:text-5xl font-bold text-foreground`}
          >
            News &<span className="text-accent italic">Promos</span>
          </h2>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-sm border border-foreground/10 bg-foreground/5 backdrop-blur-sm shadow-lg"
              >
                <div className="h-72 bg-gradient-to-br from-foreground/15 to-foreground/5"></div>
                <div className="p-4">
                  <div className="h-6 bg-foreground/15 rounded w-3/4 mb-2"></div>
                  <div className="space-y-2 mt-3">
                    <div className="h-4 bg-foreground/15 rounded"></div>
                    <div className="h-4 bg-foreground/15 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-foreground/5 backdrop-blur-sm border border-foreground/15 rounded-sm p-8 text-center shadow-2xl">
              <p className="text-destructive text-lg font-semibold">
                ⚠️ {error}
              </p>
            </div>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className="group flex flex-col overflow-hidden rounded-sm border border-foreground/10 hover:border-accent/30 bg-foreground/5 backdrop-blur-sm hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                  opacity: 0,
                }}
                onClick={() => setSelectedPost(post)}
              >
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold line-clamp-2 group-hover:text-accent transition-colors leading-tight mb-3 text-foreground">
                    {post.title}
                  </h3>
                  <p className="text-sm text-foreground/70 line-clamp-3 leading-relaxed mb-4">
                    {post.description}
                  </p>
                  <div className="mt-auto">
                    <Button className="w-full bg-accent hover:bg-accent/85 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 group/btn hover:scale-105 rounded-sm">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
            <div className="inline-block p-8 bg-foreground/5 backdrop-blur-sm rounded-sm shadow-2xl border border-foreground/15">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                No Stories Yet
              </h2>
              <p className="text-foreground/70 text-lg">
                Check back soon for news from the kitchen!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-card rounded-sm max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-accent/20 animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                {selectedPost.title}
              </h2>
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-foreground/10"></div>
              <div className="mb-6">
                <p className="text-xl text-foreground/90 leading-relaxed italic border-l-4 border-accent pl-4 bg-foreground/5 py-3 rounded-r-lg">
                  {selectedPost.description}
                </p>
              </div>
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {selectedPost.type}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
