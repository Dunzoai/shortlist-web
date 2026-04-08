# Shortlist Chat Widget - Embed Guide

Embed the Shortlist AI chat widget on any website to give visitors instant access to your SmartAssistant.

---

## Quick Start

### Minimum Code
```html
<script
  src="https://app.shortlistpass.com/embed.js"
  data-business="SUBDOMAIN"
></script>
```

### With Custom Messages
```html
<script
  src="https://app.shortlistpass.com/embed.js"
  data-business="nitos"
  data-messages="Order Empanadas|Book Our Truck|Find our Location"
></script>
```

---

## Options

| Attribute       | What it does                     | Required |
|-----------------|----------------------------------|----------|
| data-business   | SmartAssistant subdomain         | Yes      |
| data-position   | `left` or `right` (default: right) | No     |
| data-messages   | Pipe-separated rotating CTAs     | No       |

---

## Platform Guides

### Plain HTML
Add before `</body>`:
```html
<script
  src="https://app.shortlistpass.com/embed.js"
  data-business="your-subdomain"
  data-messages="Message 1|Message 2|Message 3"
></script>
```

### Next.js

Next.js `<Script>` component doesn't pass `data-*` attributes correctly. Use a client component instead:

**1. Create the component** (`components/ShortlistChatWidget.tsx`):
```tsx
'use client'

import { useEffect } from 'react'

interface ShortlistChatWidgetProps {
  business: string
  messages?: string
  position?: 'left' | 'right'
}

export default function ShortlistChatWidget({
  business,
  messages,
  position,
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
    if (position) script.setAttribute('data-position', position)

    document.body.appendChild(script)

    return () => {
      const existingScript = document.querySelector('script[src="https://app.shortlistpass.com/embed.js"]')
      if (existingScript) existingScript.remove()
    }
  }, [business, messages, position])

  return null
}
```

**2. Use in layout or page**:
```tsx
import ShortlistChatWidget from '@/components/ShortlistChatWidget'

// In your component:
<ShortlistChatWidget
  business="nitos"
  messages="Order Empanadas|Book Our Truck|Find our Location"
/>
```

### WordPress
Add to theme's `footer.php` before `</body>`, or use a plugin like "Insert Headers and Footers":
```html
<script
  src="https://app.shortlistpass.com/embed.js"
  data-business="your-subdomain"
></script>
```

### Wix
1. Go to Settings → Custom Code
2. Click "+ Add Custom Code"
3. Paste the script
4. Set placement to "Body - end"
5. Apply to "All pages"

### Squarespace
1. Go to Settings → Advanced → Code Injection
2. Paste the script in the "Footer" section
3. Save

### Shopify
1. Go to Online Store → Themes → Edit Code
2. Open `theme.liquid`
3. Paste the script before `</body>`
4. Save

---

## What It Does

- **Floating chat button** - Appears bottom-right (or left) of screen
- **Click to open** - Slide-in AI chat panel
- **Mobile** - Goes full-screen for better UX
- **Rotating CTAs** - If `data-messages` is set, button text rotates through options

---

## Example: Nitos Food Truck

```html
<script
  src="https://app.shortlistpass.com/embed.js"
  data-business="nitos"
  data-messages="Order Empanadas|Book Our Truck|Find our Location"
></script>
```

Users can ask about menu, events, ordering, catering, etc.

---

## Troubleshooting

**Widget not showing?**
- Check browser console for errors
- Verify `data-business` matches your SmartAssistant subdomain exactly
- Make sure script is placed before `</body>`

**Next.js issues?**
- Don't use the `<Script>` component - use the client component approach above
- Make sure component is marked `'use client'`

**Multiple widgets appearing?**
- The component checks for existing scripts, but if you're hot-reloading in dev, refresh the page
