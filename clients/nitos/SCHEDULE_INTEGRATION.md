# Nito's Food Truck Schedule Integration

## Overview

The "Where to Find Us" section on Damian's demo site automatically syncs with his SmartPage dashboard. When he updates his schedule in Supabase, it shows up on his website - no code changes needed.

## How It Works
```
┌─────────────────────┐      ┌─────────────────────┐      ┌─────────────────────┐
│  Damian's Browser   │      │   SmartPage API     │      │    Supabase DB      │
│  (Demo Website)     │      │ (app.shortlistpass) │      │ (smartpage_events)  │
└──────────┬──────────┘      └──────────┬──────────┘      └──────────┬──────────┘
           │                            │                            │
           │  1. Page loads             │                            │
           │ ─────────────────────────► │                            │
           │                            │  2. Query events           │
           │                            │ ─────────────────────────► │
           │                            │                            │
           │                            │  3. Return events          │
           │                            │ ◄───────────────────────── │
           │  4. Return JSON            │                            │
           │ ◄───────────────────────── │                            │
           │                            │                            │
           │  5. Render schedule        │                            │
           │     with truck animation   │                            │
           │                            │                            │
```

## Data Flow

### 1. SmartPage API Endpoint

**URL:** `https://app.shortlistpass.com/api/smartpage/nitos/events`

**Response:**
```json
{
  "business": {
    "name": "Nito's Empanadas",
    "subdomain": "nitos"
  },
  "events": [
    {
      "id": "uuid",
      "title": "Seaside Furniture Gallery & Accents",
      "description": null,
      "event_date": "2026-01-16",
      "start_time": "11:00:00",
      "end_time": "14:30:00",
      "city": "Little River",
      "state": "SC"
    }
  ]
}
```

**Source file:** `loyalty-pwa 2/app/api/smartpage/[subdomain]/events/route.ts`

### 2. FoodTruckTimeline Component

**Location:** `/clients/nitos/components/FoodTruckTimeline.tsx`

**What it does:**
1. Fetches events from the SmartPage API on page load
2. Builds a full week schedule (Monday - Sunday)
3. Merges real events with placeholder messages
4. Renders the truck animation and scrollable cards

### 3. Placeholder System

Days without scheduled events show fun placeholder messages:

| Placeholder | Details |
|-------------|---------|
| Prepping empanadas 🥟 | Getting ready for the next stop |
| Restocking the truck | Fresh ingredients incoming |
| Secret recipe testing | Something delicious brewing |
| Family day | Back on the road soon! |
| Catering prep | Working on a private event |
| Scouting new spots | Finding the best locations for you |
| Truck TLC day | Keeping the wheels rolling |
| Creating new flavors | Expanding the menu... |
| Behind the scenes | Making the magic happen |
| Recharging | Even empanada trucks need rest |

**Note:** Placeholders are consistent per date (same date = same message), not random on each page load.

### 4. Visual Differences

| Element | Real Event | Placeholder |
|---------|------------|-------------|
| Card background | Solid white (95%) | Softer white (70%) |
| Card border | Solid | Dashed |
| Title style | Bold italic | Bold (no italic) |
| Details style | Normal | Italic, lighter |

## Supabase Table

**Table:** `smartpage_events`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| business_id | UUID | FK to businesses table |
| title | TEXT | Event/location name |
| description | TEXT | Optional details |
| event_date | DATE | The date (YYYY-MM-DD) |
| start_time | TIME | Start time (HH:MM:SS) |
| end_time | TIME | End time (HH:MM:SS) |
| city | TEXT | City name |
| state | TEXT | State abbreviation |

## How Damian Updates His Schedule

1. Go to SmartPage dashboard (app.shortlistpass.com)
2. Navigate to Events section
3. Add/edit/delete events
4. Changes appear on demo site immediately (on next page load)

## API Features

- **Auto-filters past events:** Only shows events from today onwards
- **14-day limit:** Returns up to 2 weeks of events
- **CORS enabled:** Any external site can call the API
- **Gating:** Checks that SmartPage is enabled for the business

## Future Improvements

- [ ] "This Week" / "Next Week" toggle
- [ ] Show date (e.g., "Fri Jan 17") in addition to day name
- [ ] Map integration showing event locations
- [ ] Push notifications for schedule updates
- [ ] iCal feed export

## Related Files

| File | Project | Purpose |
|------|---------|---------|
| `app/api/smartpage/[subdomain]/events/route.ts` | loyalty-pwa 2 | API endpoint |
| `/clients/nitos/components/FoodTruckTimeline.tsx` | shortlist-web | UI component |
| `/clients/nitos/pages/HomePage.tsx` | shortlist-web | Uses FoodTruckTimeline |

## Reusing for Other Clients

This pattern works for any mobile business (food trucks, pop-ups, mobile services):

1. Set up their business in SmartPage with `operation_mode: 'mobile'`
2. Add events to `smartpage_events` table
3. Create their demo site component that calls:
   ```
   https://app.shortlistpass.com/api/smartpage/{subdomain}/events
   ```

The API is subdomain-agnostic - just change the subdomain in the URL!
