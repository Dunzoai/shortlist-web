# Template Build Rules (ALWAYS FOLLOW)

## The One-File Rule

For every client template, ALL editable content lives in ONE file:
`/clients/[slug]/content.ts`

This file holds everything a different business would change:
- Business name, taglines, headlines, subtitles
- All body text (about, descriptions, etc.)
- Image paths (hero image, gallery images, etc.)
- Menu items, hours, addresses, phone numbers
- Any list of repeating data (locations, menu sections, FAQ items)
- Links (order URLs, social links, map URLs)

Components MUST import and read from content.ts. Components must NEVER
hardcode any of the above directly in JSX.

## What stays in the components (NEVER in content.ts):
- Design, layout, styling, Tailwind classes
- Animations and transitions
- Component structure and logic
- Anything about how the site LOOKS or BEHAVES (vs WHAT it says)

## The test:
- Would a different business change it? → content.ts
- Is it just how the site looks/works? → stays in the component

## Why:
This makes every template editable by a human (edit content.ts), by a future
visual editor (reads/writes content.ts's shape), and by future AI (fills in
content.ts). Hardcoding content in components breaks all three.

## When building ANY new section or page:
1. Put all its editable content in content.ts under a clearly-named key
2. Import content into the component
3. Read every word/image/list from content, never hardcode
4. Keep all design in the component
