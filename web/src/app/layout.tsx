import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"
import ServiceWorkerProvider from "@/components/ServiceWorkerProvider"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Maison Plate | Filipino Grill House",
    template: "%s | Maison Plate",
  },

  description:
    "Maison Plate is a premium Filipino grill house serving thoughtfully prepared grilled dishes, classic Filipino favorites, and comforting meals in a warm, refined setting.",

  keywords: [
    "Maison Plate",
    "Filipino grill house",
    "Filipino restaurant",
    "grill house Philippines",
    "Filipino grilled food",
    "Filipino cuisine",
    "premium Filipino restaurant",
    "Filipino dining",
    "sisig",
    "pork liempo",
    "grilled Filipino food",
  ],

  authors: [{ name: "Maison Plate" }],
  creator: "Maison Plate",
  publisher: "Maison Plate",
  applicationName: "Maison Plate",

  referrer: "origin-when-cross-origin",
  manifest: "/manifest.json",

  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "/",
    siteName: "Maison Plate",
    title: "Maison Plate | Filipino Grill House",
    description:
      "A premium Filipino grill house serving grilled favorites and classic Filipino dishes in a warm, refined setting.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Maison Plate Filipino Grill House",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Maison Plate | Filipino Grill House",
    description:
      "Premium Filipino grilled dishes and classic favorites, served in a warm and refined setting.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: [
      {
        url: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },

  category: "restaurant",

  robots: {
    index: true,
    follow: true,
    nocache: false,
    noarchive: false,
    noimageindex: false,
    nosnippet: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "/",
  },
}

export const viewport = {
  themeColor: "#171512",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": "/#restaurant",
    name: "Maison Plate",
    image: ["/og-image.png"],
    description:
      "Maison Plate is a premium Filipino grill house serving grilled dishes, Filipino classics, and comforting meals in a warm and refined setting.",
    servesCuisine: ["Filipino", "Grill"],
    priceRange: "₱₱-₱₱₱",
    currenciesAccepted: "PHP",
    acceptsReservations: true,
    url: "/",
    menu: "/menu",
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "/#organization",
    name: "Maison Plate",
    url: "/",
    logo: "/logo.jpg",
    image: "/og-image.png",
    description: "Maison Plate is a premium Filipino grill house.",
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "/#website",
    url: "/",
    name: "Maison Plate",
    description: "Maison Plate — a premium Filipino grill house.",
    publisher: {
      "@id": "/#organization",
    },
    inLanguage: "en-PH",
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Menu",
        item: "/menu",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Reservations",
        item: "/reservations",
      },
    ],
  }

  const menuSchema = {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": "/menu#menu",
    name: "Maison Plate Menu",
    description:
      "Filipino grilled dishes, classic favorites, and house specialties.",
    hasMenuSection: [
      {
        "@type": "MenuSection",
        name: "Grilled Favorites",
        description:
          "House grilled meats and Filipino grill-house specialties.",
      },
      {
        "@type": "MenuSection",
        name: "Filipino Classics",
        description:
          "Classic Filipino dishes prepared with Maison Plate's signature touch.",
      },
      {
        "@type": "MenuSection",
        name: "Rice & Sides",
        description: "Rice dishes and sides made to complement every meal.",
      },
      {
        "@type": "MenuSection",
        name: "Desserts",
        description:
          "Comforting Filipino-inspired desserts and sweet finishes.",
      },
      {
        "@type": "MenuSection",
        name: "Beverages",
        description: "Refreshing beverages to accompany your meal.",
      },
    ],
    inLanguage: "en-PH",
  }

  return (
    <html lang="en-PH">
      <head>
        {/* Restaurant Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessSchema),
          }}
        />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />

        {/* Menu Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(menuSchema),
          }}
        />

        {/* Open Graph */}
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Maison Plate Filipino Grill House"
        />

        {/* Twitter */}
        <meta name="twitter:image" content="/og-image.png" />
        <meta
          name="twitter:image:alt"
          content="Maison Plate Filipino Grill House"
        />

        {/* Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Preload Logo */}
        <link rel="preload" as="image" href="/logo.jpg" />

        {/* General */}
        <meta name="format-detection" content="telephone=yes" />
        <meta name="language" content="English" />

        {/* Canonical */}
        <link rel="canonical" href="/" />

        {/* Sitemap */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </head>

      <body className="bg-[#171512] text-white font-sans antialiased">
        <ServiceWorkerProvider />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
