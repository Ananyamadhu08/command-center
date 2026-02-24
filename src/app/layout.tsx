import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { StarBackground } from "@/components/layout/StarBackground"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { KeyboardNav } from "@/components/layout/KeyboardNav"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Command Center",
  description: "Personal life OS dashboard - briefs, nutrition, habits, and more",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen relative">
          <StarBackground />
          <Sidebar />
          <KeyboardNav />
          <main className="ml-16 lg:ml-56 min-h-screen relative z-10 p-6 lg:p-10 max-w-5xl">
            <Header />
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
