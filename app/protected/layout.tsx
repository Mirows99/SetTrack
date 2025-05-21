"use client"

import { ReactNode } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import BottomTabNavigation from '@/components/dashboard/bottom-tab-navigation'

interface ProtectedLayoutProps {
  children: ReactNode
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const isMobile = useIsMobile()

  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* Show header only on desktop */}
      {!isMobile && (
        <div className="sticky top-0 z-40 w-full">
          {/* We'll keep the header rendering in each page for now 
              since it needs the user data from the server component */}
        </div>
      )}
      
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom navigation */}
      {isMobile && (
        <div className="fixed bottom-0 z-40 w-full border-t bg-background/80 backdrop-blur-sm shadow-sm">
          <BottomTabNavigation />
        </div>
      )}
    </div>
  )
} 