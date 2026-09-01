"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import logo from "@/assets/logo.jpg"
import {
  Menu,
  X,
  User,
  LogOut,
  ShoppingCart,
  Calendar,
  Settings,
  Package,
  Download,
  LayoutDashboard,
} from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Menu", href: "/menu" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
]

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const itemCount = useCartStore((state) => state.getItemCount())
  const pathname = usePathname()
  const router = useRouter()

  const isAdmin = user?.role === "admin"

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  const loadUser = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user_data")
      const token = localStorage.getItem("auth_token")

      if (storedUser && token) {
        setUser({ ...JSON.parse(storedUser), token })
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    loadUser()
    const handleUpdate = () => loadUser()

    window.addEventListener("userDataUpdated", handleUpdate)
    window.addEventListener("storage", handleUpdate)

    return () => {
      window.removeEventListener("userDataUpdated", handleUpdate)
      window.removeEventListener("storage", handleUpdate)
    }
  }, [loadUser])

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false)
    setUserMenuOpen(false)
  }, [pathname])

  // PWA install prompt handler
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstallable(false)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  if (pathname.startsWith("/admin")) return null

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    setUser(null)
    setUserMenuOpen(false)
    window.dispatchEvent(new Event("userDataUpdated"))
    router.push("/login")
  }

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="dark fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-accent/20"
    >
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-20">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src={logo}
            alt="Maison Plate"
            width={40}
            height={40}
            className="rounded-full transition-transform group-hover:scale-105"
          />
          <span
            className={`${playfair.className} text-xl md:text-2xl font-semibold text-accent tracking-wide`}
          >
            Maison Plate
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm tracking-wider uppercase font-medium pb-1 transition-colors ${
                isActive(link.href)
                  ? "text-accent"
                  : "text-foreground/70 hover:text-accent"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.span
                  layoutId="nav-active-underline"
                  className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* RIGHT DESKTOP ACTIONS */}
        <div className="hidden lg:flex items-center gap-5">
          {/* Cart Button */}
          <Link
            href="/cart"
            aria-label="View Shopping Cart"
            className="relative p-2 text-foreground/70 hover:text-accent transition-colors"
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* User Account Dropdown */}
          {user ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="User Menu"
                className="p-2 rounded-full hover:bg-foreground/5 transition-colors flex items-center justify-center"
              >
                <User
                  size={20}
                  className={isAdmin ? "text-accent" : "text-foreground/70 hover:text-accent"}
                />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-52 bg-card/95 backdrop-blur-lg border border-border rounded-md shadow-2xl overflow-hidden z-50 py-1"
                  >
                    {isAdmin ? (
                      <>
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-foreground/10 transition-colors"
                        >
                          <LayoutDashboard size={16} className="text-accent" />
                          Dashboard
                        </Link>
                        <div className="border-t border-border my-1" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-accent w-full hover:bg-foreground/10 transition-colors text-left"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/orders"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-foreground/10 transition-colors"
                        >
                          <Package size={16} /> Orders
                        </Link>
                        <Link
                          href="/reservation-history"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-foreground/10 transition-colors"
                        >
                          <Calendar size={16} /> Reservations
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-foreground/10 transition-colors"
                        >
                          <Settings size={16} /> Account
                        </Link>
                        <div className="border-t border-border my-1" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-accent w-full hover:bg-foreground/10 transition-colors text-left"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm tracking-wider uppercase font-medium text-foreground/70 hover:text-accent transition-colors"
            >
              Log In
            </Link>
          )}

          {/* Book Table Button */}
          <Link
            href="/reservations"
            className="bg-accent text-accent-foreground font-medium text-sm px-5 py-2.5 rounded hover:bg-accent/85 transition-all shadow-sm"
          >
            Book a Table
          </Link>

          {/* PWA Download Button */}
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              aria-label="Install App"
              className="bg-foreground/10 text-accent p-2.5 rounded hover:bg-foreground/15 transition-colors"
              title="Install App"
            >
              <Download size={18} />
            </button>
          )}
        </div>

        {/* MOBILE & TABLET HEADER CONTROLS */}
        <div className="flex items-center gap-3 lg:hidden">
          {/* Mobile Cart */}
          <Link
            href="/cart"
            aria-label="View Shopping Cart"
            className="relative p-2 text-foreground/70 hover:text-accent transition-colors"
          >
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle Menu"
            className="p-2 text-foreground hover:text-accent transition-colors focus:outline-none"
          >
            {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV DRAWER */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-accent/20 bg-background/95 backdrop-blur-xl px-6 py-6 overflow-hidden"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-medium tracking-wide transition-colors ${
                    isActive(link.href)
                      ? "text-accent"
                      : "text-foreground/80 hover:text-accent"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-border pt-4 mt-2 space-y-3">
                {user ? (
                  <>
                    {isAdmin ? (
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-3 text-sm text-foreground hover:text-accent"
                      >
                        <LayoutDashboard size={18} className="text-accent" />
                        Admin Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/orders"
                          className="flex items-center gap-3 text-sm text-foreground hover:text-accent"
                        >
                          <Package size={18} /> Orders
                        </Link>
                        <Link
                          href="/reservation-history"
                          className="flex items-center gap-3 text-sm text-foreground hover:text-accent"
                        >
                          <Calendar size={18} /> Reservations
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 text-sm text-foreground hover:text-accent"
                        >
                          <Settings size={18} /> Account
                        </Link>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 text-sm text-accent w-full text-left pt-2"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block text-sm font-medium text-foreground hover:text-accent"
                  >
                    Log In
                  </Link>
                )}
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <Link
                  href="/reservations"
                  className="bg-accent text-accent-foreground font-medium text-center py-3 rounded hover:bg-accent/85 transition-colors"
                >
                  Book a Table
                </Link>

                {isInstallable && (
                  <button
                    onClick={handleInstallClick}
                    className="bg-foreground/10 text-accent font-medium py-3 rounded flex items-center justify-center gap-2 hover:bg-foreground/15 transition-colors"
                  >
                    <Download size={18} /> Install App
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}