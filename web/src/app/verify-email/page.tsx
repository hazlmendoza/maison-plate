"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import logo from "@/assets/logo.jpg"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid verification link. No token provided.')
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`)
        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage(data.message || 'Email verified successfully!')
        } else {
          setStatus('error')
          setMessage(data.message || 'Email verification failed.')
        }
      } catch {
        setStatus('error')
        setMessage('An error occurred during verification. Please try again.')
      }
    }

    verifyEmail()
  }, [token, router])

  return (
    // `dark` forced so this page stays the same blackened-steel/copper
    // room as the rest of the site, regardless of the theme toggle.
    <div className="dark min-h-screen py-26 flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md backdrop-blur-xl bg-card border border-accent/30 shadow-2xl rounded-sm overflow-hidden">

        {/* Header */}
        <div className="flex flex-col justify-center items-center p-3 border-b border-accent/30">
          <div className="flex justify-center items-center gap-3">
            <Image src={logo} alt="Maison Plate" width={60} height={40} className="rounded-full" />
            <h1 className={`${playfair.className} text-3xl font-semibold text-accent tracking-wide`}>
              Maison Plate
            </h1>
          </div>
          <span className="text-foreground/50">Email Verification</span>
        </div>

        <CardContent className="py-8 text-center text-foreground">

          {status === 'loading' && (
            <div className="space-y-4">
              <Loader2 className="w-14 h-14 text-accent animate-spin mx-auto" />
              <p className="text-sm text-foreground/80">Verifying your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <CheckCircle className="w-14 h-14 text-[var(--chart-4)] mx-auto" />
              <h2 className="text-xl font-semibold text-[var(--chart-4)]">Success!</h2>
              <p className="text-md text-foreground/80">{message}</p>
              <Link href="/login">
                <Button className="mt-4 bg-accent hover:bg-accent/85 text-accent-foreground font-semibold rounded-sm px-6">
                  Go to Login
                </Button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div>
              <XCircle className="w-14 h-14 text-destructive mx-auto" />
              <h2 className="text-xl font-semibold text-destructive">Verification Failed</h2>
              <p className="text-sm text-foreground/80">{message}</p>

              <div className="flex flex-col gap-2 mt-4">
                <Link href="/login">
                  <Button variant="outline" className="w-full rounded-sm border-border bg-foreground/10 text-foreground hover:bg-foreground/15">
                    Go to Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full rounded-sm bg-accent hover:bg-accent/85 text-accent-foreground font-semibold">
                    Register Again
                  </Button>
                </Link>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="dark min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-12 h-12 text-accent animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}