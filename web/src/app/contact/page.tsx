"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "@/hooks/use-toast"
import { CheckCircle, AlertCircle, ChevronDown, Pi } from "lucide-react"
import { Playfair_Display } from "next/font/google"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import Loading from "@/components/loading"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.name ||
      !formData.email ||
      !formData.message ||
      !formData.subject
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: "Message Sent!",
          description:
            data.message ||
            "Thank you for contacting us. We'll get back to you within 24 hours.",
          action: <CheckCircle className="h-5 w-5 text-[var(--chart-4)]" />,
        })

        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send message.",
          variant: "destructive",
          action: <AlertCircle className="h-5 w-5 text-destructive" />,
        })
      }
    } catch (err) {
      toast({
        title: "Connection Error",
        description: "Unable to send message. Check your connection.",
        variant: "destructive",
        action: <AlertCircle className="h-5 w-5 text-destructive" />,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = [
    {
      question: "Do you accept walk-in customers?",
      answer:
        "Yes, we accept walk-ins depending on table availability. We recommend reservations during peak hours.",
    },
    {
      question: "What are your operating hours?",
      answer:
        "We are open daily. Mon–Fri: 11:00 AM – 10:00 PM, Saturday: 11:00 AM – 11:00 PM, Sunday: 11:00 AM – 9:00 PM.",
    },
    {
      question: "Do you offer reservations?",
      answer:
        "Yes, you can reserve a table through our reservation system or by contacting us directly.",
    },
    {
      question: "Can I host private events?",
      answer:
        "Absolutely. We offer private dining and event setups. Please contact us for arrangements and availability.",
    },
  ]

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
    // `dark` forced so this page stays the same blackened-steel/copper
    // room as the rest of the site, regardless of the theme toggle.
    <div className="dark min-h-screen bg-background text-foreground">
      <section className="py-24 justify-center flex">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="text-accent tracking-[0.3em] uppercase text-sm mb-3">
              Get In Touch
            </p>
            <h1
              className={`${playfair.className} font-heading text-4xl md:text-5xl font-bold`}
            >
              Contact <span className="text-accent italic">Us</span>
            </h1>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="bg-card rounded-sm p-10 border border-accent/30 transition hover:shadow-lg hover:shadow-accent/20 backdrop-blur"
            >
              <div className="grid grid-cols-2 gap-6 my-2">
                {/* Name */}
                <div>
                  <label className="text-sm text-foreground/60 mb-2 block">
                    Name
                  </label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full rounded-sm bg-background border border-border px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/40"
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm text-foreground/60 mb-2 block">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full rounded-sm bg-background border border-border px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/40"
                    placeholder="you@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm text-foreground/60 mb-2 block">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full rounded-sm bg-background border border-border px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/40"
                    placeholder="Your phone number"
                  />
                </div>

                {/* Inquiry Type */}
                <div>
                  <label className="text-sm text-foreground/60 mb-2 block">
                    Inquiry Type
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) =>
                      handleInputChange("subject", e.target.value)
                    }
                    className="w-full rounded-sm bg-background border border-border p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    <option value="">Select an option</option>
                    <option value="general">General Inquiry</option>
                    <option value="reservation">Reservation</option>
                    <option value="complaint">Complaint</option>
                    <option value="suggestion">Suggestion</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-6 my-2">
                {/* Message */}
                <div>
                  <label className="text-sm text-foreground/60 mb-2 block">
                    Message
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                    rows={5}
                    className="w-full rounded-sm bg-background border border-border px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none"
                    placeholder="How can we help?"
                  />
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-sm bg-accent py-3.5 font-semibold text-accent-foreground transition-all hover:bg-accent/85 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </motion.form>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-20">
            <div className="text-center">
              <Phone className="mx-auto mb-3 text-accent" />
              <h2 className={`${playfair.className} text-2xl font-bold`}>
                Call Us
              </h2>
              <p className="text-foreground/60"> Mon-Sat from 9am - 10pm </p>
              <p className="text-foreground/60 font-bold"> (555) 234-5678 </p>
            </div>
            <div className="text-center border-x-2 border-border">
              <MapPin className="mx-auto mb-3 text-accent" />
              <h2 className={`${playfair.className} text-2xl font-bold`}>
                Our Location
              </h2>
              <p className="text-foreground/60"> Come say hello!</p>
              <p className="text-foreground/60 font-bold">
                {" "}
                42 Crescent Lane, Downtown{" "}
              </p>
            </div>
            <div className="text-center">
              <Mail className="mx-auto mb-3 text-accent" />
              <h2 className={`${playfair.className} text-2xl font-bold`}>
                Email Us
              </h2>
              <p className="text-foreground/60"> Drop us an email anytime! </p>
              <p className="text-foreground/60 font-bold">
                {" "}
                hello@maisonplate.com{" "}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-border">
        <div className="container px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-accent tracking-[0.3em] uppercase text-sm mb-3">
              FAQ
            </p>
            <h2
              className={`${playfair.className} text-3xl md:text-4xl font-bold`}
            >
              Frequently Asked{" "}
              <span className="text-accent italic">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index

              return (
                <div
                  key={index}
                  className="border border-border rounded-sm bg-card overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                  >
                    <span className="font-medium text-foreground">
                      {faq.question}
                    </span>

                    <ChevronDown
                      className={`w-5 h-5 text-accent transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-4 text-sm text-foreground/70"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
