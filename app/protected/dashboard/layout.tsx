'use client'

import { ReactNode } from 'react'

import BottomTabNavigation from '@/components/dashboard/bottom-tab-navigation'
import { useIsMobile } from '@/hooks/use-mobile'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
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

      <main className={`flex-1 pb-16 md:pb-0 ${isMobile ? 'pt-12' : ''}`}>
        {children}
      </main>

      {/* Mobile bottom navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-40 w-full border-t bg-background/80 backdrop-blur-sm shadow-sm">
          <BottomTabNavigation />
        </div>
      )}
    </div>
  )
}
