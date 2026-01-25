'use client'

import { useEffect } from 'react'

interface ShortlistChatWidgetProps {
  business: string
  messages?: string
  color?: string
  position?: 'left' | 'right'
  greeting?: string
}

export default function ShortlistChatWidget({
  business,
  messages,
  color,
  position,
  greeting,
}: ShortlistChatWidgetProps) {
  useEffect(() => {
    // Check if script already exists
    if (document.querySelector('script[src="https://app.shortlistpass.com/embed.js"]')) {
      return
    }

    const script = document.createElement('script')
    script.src = 'https://app.shortlistpass.com/embed.js'
    script.setAttribute('data-business', business)

    if (messages) script.setAttribute('data-messages', messages)
    if (color) script.setAttribute('data-color', color)
    if (position) script.setAttribute('data-position', position)
    if (greeting) script.setAttribute('data-greeting', greeting)

    document.body.appendChild(script)

    return () => {
      // Cleanup on unmount
      const existingScript = document.querySelector('script[src="https://app.shortlistpass.com/embed.js"]')
      if (existingScript) {
        existingScript.remove()
      }
      // Also remove any widget elements the script might have created
      const widget = document.querySelector('[data-shortlist-widget]')
      if (widget) widget.remove()
    }
  }, [business, messages, color, position, greeting])

  return null
}
