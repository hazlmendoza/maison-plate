"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, RotateCcw } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

const FAQ_DATA = [
  {
    question: "What type of establishment is Maison Plate?",
    answer:
      "Maison Plate is a rustic-industrial restaurant specializing in wood-fired mains, seasonal plates, and a curated wine and cocktail list. Our dining room is built from reclaimed steel and aged oak, with an open kitchen you can watch from your table.",
  },
  {
    question: "What are your operating hours?",
    answer:
      "Our operating hours are Monday to Friday from 11:00 AM to 10:00 PM, Saturday from 11:00 AM to 11:00 PM, and Sunday from 11:00 AM to 9:00 PM.",
  },
  {
    question: "Do you offer vegetarian or vegan options?",
    answer:
      "Yes! We offer vegetarian and vegan options including wood-fired vegetable mains, plant-based sides, and dairy-free dessert options. Just let your server know and we'll walk you through what's available.",
  },
  {
    question: "What makes Maison Plate special?",
    answer:
      "Maison Plate stands out with our commitment to live-fire cooking, honestly sourced ingredients, and a dining room built to feel like a workshop rather than a restaurant. Whether it's a long lunch or a late dinner by the fire, we aim to make it memorable.",
  },
  {
    question: "Do you take reservations?",
    answer:
      "Yes, we accept reservations! You can book a table through our website or contact us directly. We recommend reservations for evening dining and special occasions.",
  },
  {
    question: "What are your signature items?",
    answer:
      "Our signature items include our wood-fired mains, seasonal chef's specials, and a hand-picked wine and cocktail list. Each dish is prepared over live fire with ingredients sourced from local farms and butchers.",
  },
]

export default function CustomerServiceChatbot() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isChatEnded, setIsChatEnded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && messages.length === 0 && !isChatEnded) {
      setTimeout(() => {
        addBotMessage("Hello! Welcome to Maison Plate! Please select a question below to get started.")
      }, 500)
    }
  }, [isOpen])

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages, isTyping])

  const addBotMessage = (text: string) => {
    const messageId = Date.now().toString()
    const newMessage: Message = {
      id: messageId,
      text: "",
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])

    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, text: text.substring(0, currentIndex + 1) } : msg)),
        )
        currentIndex++
      } else {
        clearInterval(typingInterval)
      }
    }, 60)
  }

  const handleEndChat = () => {
    setIsTyping(true)
    setTimeout(() => {
      addBotMessage(
        "Thank you for chatting with Maison Plate! This conversation has ended. If you have more questions, please start a new chat. We hope to serve you soon!",
      )
      setIsTyping(false)
      setIsChatEnded(true)
    }, 2000)
  }

  const handleNewChat = () => {
    setMessages([])
    setIsChatEnded(false)
    setTimeout(() => {
      addBotMessage(
        "Hello! Welcome back to Maison Plate! Please select a question below to get started.",
      )
    }, 500)
  }

  const handleFAQClick = (question: string, answer: string) => {
    if (isChatEnded) return

    const questionMessage: Message = {
      id: Date.now().toString(),
      text: question,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, questionMessage])

    setIsTyping(true)
    setTimeout(() => {
      addBotMessage(answer)
      setIsTyping(false)
    }, 2000)
  }

  if (pathname.startsWith("/admin")) {
    return null
  } 

  return (
    // `dark` forced on both the floating button and chat window so they
    // stay the same blackened-steel/copper look as the rest of the site,
    // regardless of the theme toggle.
    <div className="dark">
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-xl bg-gradient-to-r from-accent to-[oklch(0.4_0.09_38)] hover:from-accent/90 hover:to-[oklch(0.45_0.09_38)] z-50 transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <MessageCircle className="h-7 w-7 text-accent-foreground" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-[500px] h-[85vh] md:h-[600px] max-h-[700px] shadow-2xl z-50 flex flex-col border-accent/20 rounded-t-sm md:rounded-sm overflow-hidden p-0 bg-card">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-accent to-[oklch(0.4_0.09_38)] text-accent-foreground flex flex-row items-center justify-between p-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-accent-foreground/20 flex items-center justify-center backdrop-blur-sm">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Customer Service</CardTitle>
                <p className="text-xs text-accent-foreground/90 flex items-center gap-1">
                  <span className="w-2 h-2 bg-accent-foreground rounded-full animate-pulse"></span>
                  Maison Plate
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-accent-foreground hover:bg-accent-foreground/20 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden bg-background">
            {/* Messages Area */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea ref={scrollAreaRef} className="h-full px-4 py-3">
                <div className="space-y-3 pb-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-sm px-4 py-2.5 shadow-sm ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-accent to-[oklch(0.4_0.09_38)] text-accent-foreground rounded-tr-sm"
                            : "bg-foreground/5 text-foreground border border-border rounded-tl-sm"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p
                          className={`text-[10px] mt-1.5 ${
                            message.sender === "user" ? "text-accent-foreground/80" : "text-foreground/40"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-foreground/5 rounded-sm rounded-tl-sm px-4 py-3 shadow-sm border border-border">
                        <div className="flex gap-1">
                          <div
                            className="w-2 h-2 bg-accent rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-accent rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-accent rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Quick Replies Section */}
            {!isChatEnded && (
              <div className="border-t border-border bg-card px-4 py-3 flex-shrink-0">
                <p className="text-[11px] font-semibold text-foreground/50 mb-2.5 uppercase tracking-wide">Quick replies:</p>
                <div className="max-h-[140px] overflow-y-auto">
                  <div className="flex flex-wrap gap-2 pr-1">
                    {FAQ_DATA.map((faq, index) => (
                      <button
                        key={index}
                        onClick={() => handleFAQClick(faq.question, faq.answer)}
                        disabled={isTyping}
                        className="text-[11px] px-3 py-1.5 rounded-sm border border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground hover:border-accent bg-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium whitespace-normal text-left leading-snug"
                      >
                        {faq.question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-border px-4 py-3 bg-card flex-shrink-0">
              {!isChatEnded ? (
                <Button
                  onClick={handleEndChat}
                  variant="outline"
                  className="w-full text-sm rounded-sm border border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground hover:border-accent bg-transparent font-medium h-10 transition-all duration-200"
                  disabled={isTyping}
                >
                  End Chat
                </Button>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-foreground/50 mb-3 font-medium">Chat has ended</p>
                  <Button
                    onClick={handleNewChat}
                    className="w-full rounded-sm bg-gradient-to-r from-accent to-[oklch(0.4_0.09_38)] hover:from-accent/90 hover:to-[oklch(0.45_0.09_38)] text-accent-foreground font-medium h-10 shadow-md"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Start New Chat
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}