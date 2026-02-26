"use client"

import { SidebarProvider, Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { KeyboardNav } from "@/components/layout/KeyboardNav"
import { IconGradientDef } from "@/components/ui/IconGradientDef"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <IconGradientDef />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <KeyboardNav />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <main className="relative z-10 p-6 lg:p-10 max-w-5xl mx-auto w-full">
            <Header />
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
