"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Playfair_Display } from "next/font/google"
import { Flame, Star, X } from "lucide-react"
import Image from "next/image"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cartStore"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

interface Product {
  id: number
  name: string
  description: string
  ingredients: string
  category: string
  price: number
  image?: string | null
  best_seller?: boolean
}

export default function FeaturedMenu() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { addItem } = useCartStore()

  const ITEMS_PER_PAGE = 4
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)

  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const fetchBestSellers = async () => {
    try {
      setLoading(true)

      const res = await fetch("/api/product?best_seller=true&paginate=false")
      const data = await res.json()

      if (!res.ok) throw new Error(data.message)

      setProducts(data)
    } catch (error) {
      console.error(error)

      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load best sellers",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBestSellers()
  }, [])

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setDialogOpen(true)
  }

  const handleAddToCart = (product: Product) => {
    addItem(product)
    toast({
      title: "Added to cart",
      description: `${product.name} added to your order.`,
    })
  }

  const getImageUrl = (imagePath?: string | null) => {
    if (!imagePath) return "/placeholder-food.jpg"

    if (imagePath.startsWith("http")) return imagePath

    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

    return `${base}/images/products/${imagePath}`
  }

  return (
    // `dark` forced so this section stays the same blackened-steel room as
    // the hero and offer section, regardless of the site-wide theme toggle.
    <section className="dark relative py-24 bg-gradient-to-br from-background via-background to-secondary/40 text-foreground overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-accent/5 rounded-full blur-xl" />
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-accent/8 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-accent/6 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <p className="text-accent tracking-[0.3em] uppercase text-sm mb-3">
            Customer Favorites
          </p>
          <h2
            className={`${playfair.className} text-4xl md:text-5xl font-bold`}
          >
            Best <span className="text-accent italic">Sellers</span>
          </h2>
        </motion.div>

        {/* LOADING STATE */}
        {loading && (
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex gap-5 p-5 rounded-sm bg-foreground/5 border border-foreground/10"
              >
                {/* image skeleton */}
                <div className="w-24 h-24 rounded-sm bg-foreground/10" />

                {/* content skeleton */}
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 w-1/2 bg-foreground/10 rounded" />
                    <div className="h-4 w-10 bg-foreground/10 rounded" />
                  </div>

                  <div className="h-3 w-full bg-foreground/10 rounded" />
                  <div className="h-3 w-3/4 bg-foreground/10 rounded" />

                  <div className="h-5 w-24 bg-foreground/10 rounded-sm mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CONTENT */}
        {!loading && products.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-x-16 gap-y-6"
            >
              {paginatedProducts.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="group cursor-pointer"
                  onClick={() => handleProductClick(item)}
                >
                  <div
                    className="group cursor-pointer rounded-sm bg-foreground/5 border border-foreground/10
                            hover:border-accent/30 hover:bg-foreground/10 transition-all duration-300
                            overflow-hidden"
                  >
                    <div
                      className="p-5 flex gap-5"
                      onClick={() => handleProductClick(item)}
                    >
                      {/* IMAGE */}
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-sm overflow-hidden">
                        <Image
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1 flex flex-col justify-between">
                        {/* TITLE */}
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <h3
                                className={`${playfair.className} text-lg font-semibold group-hover:text-accent transition-colors`}
                              >
                                {item.name}
                              </h3>

                              {item.best_seller === true && (
                                <Star className="w-4 h-4 text-accent" />
                              )}
                            </div>

                            <span className="text-accent text-sm font-bold">
                              ₱{item.price}
                            </span>
                          </div>

                          <p className="text-sm text-foreground/60 mt-2 line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        {/* META */}
                        <div className="flex items-center justify-between mt-4">
                          <span className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-sm bg-accent/10 text-accent border border-accent/20">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="flex flex-col gap-3 items-center justify-center">
              {/* PAGINATION */}
              <div className="text-center flex items-center justify-center">
                {products.length > ITEMS_PER_PAGE && (
                  <div className="flex items-center justify-center gap-4 mt-10">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-sm bg-foreground/10 border border-foreground/10 disabled:opacity-40"
                    >
                      Prev
                    </button>

                    <span className="text-sm text-foreground/60">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-sm bg-foreground/10 border border-foreground/10 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="text-center flex items-center justify-center">
                <button
                  onClick={() => (window.location.href = "/menu")}
                  className="px-8 py-3 rounded-sm bg-accent hover:bg-accent/85 text-accent-foreground border border-accent/20 transition"
                >
                  View Full Menu
                </button>
              </div>
            </div>
          </>
        )}

        {/* Empty */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
              <Flame className="w-8 h-8 text-accent" />
            </div>

            <h3 className={`${playfair.className} text-2xl font-semibold mb-2`}>
              No Best Sellers Yet
            </h3>

            <p className="text-foreground/60 max-w-md">
              Our most loved plates will appear here once guests start ordering.
              Stay tuned for our top picks.
            </p>

            <div className="mt-6 h-[1px] w-24 bg-accent/30" />
          </div>
        )}

        {/* Product Detail Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl p-0 overflow-hidden bg-card text-foreground border border-border rounded-sm">
            {/* IMAGE HEADER */}
            <div className="relative w-full h-72">
              <Image
                src={getImageUrl(selectedProduct?.image)}
                alt={selectedProduct?.name || ""}
                fill
                className="object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-background/30 to-transparent" />
            </div>

            {/* CONTENT */}
            <div className="p-6 space-y-5">
              {/* TITLE + PRICE + CATEGORY */}
              <div className="flex items-start justify-between">
                <DialogTitle className="text-2xl font-bold text-accent flex justify-center items-center">
                  <span className={`${playfair.className}`}>
                    {selectedProduct?.name}
                  </span>

                  {/* CATEGORY */}
                  <span className="inline-flex items-center gap-2 text-sm px-3 py-1 mx-2 rounded-sm bg-foreground/5 border border-border text-foreground/70">
                    {selectedProduct?.category}
                  </span>
                </DialogTitle>

                <div className="text-xl font-bold text-foreground">
                  ₱{selectedProduct?.price}
                </div>
              </div>

              {/* DESCRIPTION */}
              <p className="text-foreground/70 text-sm leading-relaxed">
                {selectedProduct?.description}
              </p>

              {/* ACTION */}
              <Button
                onClick={() => {
                  selectedProduct && handleAddToCart(selectedProduct)
                  setDialogOpen(false)
                }}
                className="w-full bg-accent hover:bg-accent/85 text-accent-foreground font-semibold py-3 rounded-sm"
              >
                Add to Cart
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
