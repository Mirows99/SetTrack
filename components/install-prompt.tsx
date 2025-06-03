'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    console.log(`User response to the install prompt: ${outcome}`)

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  if (isStandalone) {
    return null // Don't show install prompt if already installed
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Install App</h3>
      
      {showPrompt && !isIOS && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Install this app on your device for a better experience!
          </p>
          <Button onClick={handleInstallClick} className="w-full">
            Add to Home Screen
          </Button>
        </div>
      )}

      {isIOS && (
        <div>
          <p className="text-sm text-gray-600 mb-2">
            To install this app on your iOS device:
          </p>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. Tap the share button 
              <span role="img" aria-label="share icon" className="mx-1">
                📤
              </span>
            </li>
            <li>2. Then select "Add to Home Screen" 
              <span role="img" aria-label="plus icon" className="mx-1">
                ➕
              </span>
            </li>
          </ol>
        </div>
      )}

      {!showPrompt && !isIOS && (
        <p className="text-sm text-gray-500">
          Install option will appear when criteria are met
        </p>
      )}
    </div>
  )
}

export default InstallPrompt