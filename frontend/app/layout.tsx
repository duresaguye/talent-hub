import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Open_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/AuthContext"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["400", "600", "700", "900"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "TalentHub - Find Your Dream Job | Modern Job Portal Platform",
  description: "Connect with top employers and discover your next career opportunity. TalentHub is a comprehensive job portal featuring advanced search, application tracking, and seamless hiring solutions for both job seekers and employers.",
  keywords: ["jobs", "careers", "employment", "hiring", "job portal", "talent", "recruitment"],
  authors: [{ name: "TalentHub Team" }],
  creator: "TalentHub",
  publisher: "TalentHub",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://talent-hub-blond.vercel.app",
    siteName: "TalentHub",
    title: "TalentHub - Find Your Dream Job | Modern Job Portal Platform",
    description: "🚀 Connect with top employers and discover your next career opportunity. Advanced job search, application tracking, and seamless hiring solutions. Join thousands of professionals finding their perfect match!",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: "TalentHub - Modern Job Portal Platform connecting talent with opportunities",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@talenthub",
    creator: "@talenthub",
    title: "TalentHub - Find Your Dream Job | Modern Job Portal Platform",
    description: "🚀 Connect with top employers and discover your next career opportunity. Advanced job search, application tracking, and seamless hiring solutions. Join thousands of professionals! #Jobs #Careers #Hiring",
    images: [
      {
        url: "/hero.png",
        alt: "TalentHub - Modern Job Portal Platform connecting talent with opportunities",
      },
    ],
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#1E40AF",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${montserrat.variable} ${openSans.variable} antialiased`}>
      <body suppressHydrationWarning>
        <ThemeProvider defaultTheme="system" storageKey="talenthub-ui-theme">
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
