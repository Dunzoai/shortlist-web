# How Events Work - Palmetto Taps

This document explains how the dynamic events system works for Palmetto Taps.

## Overview

Events are managed in two places:
1. **SmartPage Dashboard** - Special one-time events (live music, tastings, etc.)
2. **Static Content File** - Weekly recurring events (Thirsty Thursday, Wine Wednesday, etc.)

The website pulls from both sources and displays them on `/events`.

---

## Special Events (Dynamic from SmartPage)

### How It Works

1. **Create Event in SmartPage Dashboard**
   - Go to: `https://palmettotaps.shortlistpass.com` (admin)
   - Add event with: title, date, start time, end time, description
   - Save event

2. **Event Appears Automatically**
   - Website fetches from API: `https://app.shortlistpass.com/api/smartpage/palmettotaps/events`
   - Component: `clients/palmetto_taps/components/EventsCalendar.tsx`
   - Displays at: `https://demo-palmettotaps.shortlistpass.com/events`

3. **Smart Image Matching**
   - Event title is scanned for keywords
   - Matching keyword triggers corresponding template image
   - If no match → uses `default.jpg`

### Event Templates

Add your images to: `/public/clients/palmetto_taps/events/`

| Template | Keywords | Image File |
|----------|----------|------------|
| **Live Music** | "music", "band", "live", "concert", "performer", "acoustic" | `live-music.jpg` |
| **Thirsty Thursday** | "thirsty thursday", "thursday", "$3" | `thirsty-thursday.jpg` |
| **Wine Wednesday** | "wine wednesday", "wine", "wednesday" | `wine-wednesday.jpg` |
| **Teal Tuesday** | "teal tuesday", "tuesday", "coastal carolina" | `teal-tuesday.jpg` |
| **Food Events** | "burger", "food", "smash", "eat", "kitchen", "meal" | `food.jpg` |
| **Trivia Night** | "trivia", "quiz", "game night" | `trivia.jpg` |
| **Cigars** | "cigar", "humidor", "hookup", "smoke" | `cigars.jpg` |
| **Tasting Events** | "tasting", "flight", "sample", "brewery", "craft" | `tasting.jpg` |
| **Default** | (anything else) | `default.jpg` |

### Example Usage

**Create event in SmartPage:**
- **Title:** "Live Music Friday with The Band"
- **Date:** 2026-02-07
- **Time:** 6:00 PM - 9:00 PM
- **Description:** "Come enjoy live acoustic music on our patio!"

**Result:**
- Website detects keyword "music" in title
- Displays event card with `live-music.jpg` background
- Shows date badge, time, description automatically

---

## Weekly Recurring Events (Static)

### How It Works

1. **Edit Content File**
   - File: `clients/palmetto_taps/content/business.ts`
   - Look for `export const weeklyEvents = [...]`

2. **Add/Edit Event**
   ```typescript
   {
     day: "Monday",
     name: "Humidor Hookup",
     description: "Buy 3 cigars, get the 4th free"
   }
   ```

3. **Displays Automatically**
   - Shows in "Weekly Schedule" section on `/events`
   - No SmartPage dashboard needed
   - Good for permanent weekly deals

---

## Adding New Event Templates

### Option 1: Add to Existing Templates

1. **Add Image:**
   ```bash
   # Add your image to:
   public/clients/palmetto_taps/events/your-event-type.jpg
   ```

2. **Update Component:**
   - File: `clients/palmetto_taps/components/EventsCalendar.tsx`
   - Find `const eventTemplates = {`
   - Add new template:
   ```typescript
   yourEventType: {
     keywords: ["keyword1", "keyword2", "phrase"],
     image: "/clients/palmetto_taps/events/your-event-type.jpg",
     gradient: "from-blue-500 to-green-500",
   },
   ```

3. **Commit & Push:**
   ```bash
   git add .
   git commit -m "Add new event template"
   git push origin main
   ```

### Option 2: Change Colors Only

Edit the `gradient` value in `EventsCalendar.tsx`:
- `"from-purple-500 to-pink-500"` → Purple to pink
- `"from-amber-500 to-yellow-500"` → Orange to yellow
- `"from-teal-500 to-cyan-500"` → Teal to cyan

Full Tailwind color list: https://tailwindcss.com/docs/customizing-colors

---

## File Structure

```
clients/palmetto_taps/
├── components/
│   └── EventsCalendar.tsx          # Fetches & displays SmartPage events
├── pages/
│   └── EventsPage.tsx              # Main events page layout
├── content/
│   └── business.ts                 # Weekly recurring events
└── HOW_EVENTS_WORK.md             # This file

public/clients/palmetto_taps/events/
├── README.md                       # Image specs
├── live-music.jpg                  # Add your images here
├── thirsty-thursday.jpg
├── wine-wednesday.jpg
├── teal-tuesday.jpg
├── food.jpg
├── trivia.jpg
├── cigars.jpg
├── tasting.jpg
└── default.jpg
```

---

## API Response Format

The SmartPage API returns events in this format:

```json
{
  "events": [
    {
      "id": "123",
      "title": "Live Music Friday",
      "description": "Enjoy acoustic music on the patio",
      "event_date": "2026-02-07",
      "start_time": "18:00:00",
      "end_time": "21:00:00",
      "city": "Conway",
      "state": "SC",
      "location_notes": "Outdoor patio seating available"
    }
  ]
}
```

---

## Troubleshooting

### Images Not Showing
1. Check image exists at `/public/clients/palmetto_taps/events/[filename].jpg`
2. Verify image path in `EventsCalendar.tsx`
3. Clear browser cache and refresh
4. Check browser console for 404 errors

### Event Not Auto-Detecting Template
1. Check if event title includes one of the keywords
2. Keywords are case-insensitive: "MUSIC" matches "music"
3. Partial matches work: "Live Music Friday" matches keyword "music"
4. Add more keywords to template if needed

### Events Not Loading from SmartPage
1. Verify event exists in SmartPage dashboard
2. Check API endpoint: `https://app.shortlistpass.com/api/smartpage/palmettotaps/events`
3. Open browser console, look for fetch errors
4. Verify `palmettotaps` subdomain is correct

---

## Quick Checklist

**To add a one-time event:**
- [ ] Log into SmartPage dashboard
- [ ] Create event with title, date, time, description
- [ ] Include keyword in title for auto-image matching
- [ ] Save - appears on website automatically

**To add a weekly recurring event:**
- [ ] Edit `clients/palmetto_taps/content/business.ts`
- [ ] Add to `weeklyEvents` array
- [ ] Commit and push to GitHub
- [ ] Vercel auto-deploys

**To add new event template:**
- [ ] Add image to `/public/clients/palmetto_taps/events/`
- [ ] Update `eventTemplates` in `EventsCalendar.tsx`
- [ ] Add keywords for auto-detection
- [ ] Commit and push

---

## Support

- **SmartPage Dashboard:** https://palmettotaps.shortlistpass.com
- **Live Website:** https://demo-palmettotaps.shortlistpass.com/events
- **GitHub Repo:** https://github.com/Dunzoai/shortlist-web
- **API Endpoint:** https://app.shortlistpass.com/api/smartpage/palmettotaps/events

---

*Last updated: 2026-02-04*
