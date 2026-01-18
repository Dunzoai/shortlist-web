# Nito's Empanadas - Client Documentation

## Business Overview

- **Business:** Nito's Empanadas - Food truck in Myrtle Beach, SC
- **Owner:** Damian (named after his grandfather "Nito")
- **Website:** `demo-nitos.shortlistpass.com`
- **Database slug:** `nitos`

---

## Brand Kit

### Colors
- **Primary:** `#2D5A3D` (forest green)
- **Secondary:** `#C4A052` (gold)
- **Accent:** `#D4C5A9` (warm beige)
- **Text:** `#3D3D3D` (charcoal)

### Typography
- **Logo/Headers:** Permanent Marker (Google Font) - handwritten chalk style
- **Body:** System sans-serif

### Brand Voice
- Authentic, family heritage, handcrafted
- "You want empanadas?"

---

## Pages

| Page | File | Route |
|------|------|-------|
| Homepage | `/clients/nitos/pages/HomePage.tsx` | `/` |
| Game | `/clients/nitos/pages/GamePage.tsx` | `/game` |

---

## Components

| Component | File | Description |
|-----------|------|-------------|
| Header | `components/Header.tsx` | Navigation with links to sections |
| AnimatedHero | `components/AnimatedHero.tsx` | Hero with empanada animations, "Find Us" button |
| MenuSection | `components/MenuSection.tsx` | Chalkboard-style menu with Savory/Sweet tabs |
| FoodTruckTimeline | `components/FoodTruckTimeline.tsx` | Weekly schedule showing truck locations |
| ParallaxSection | `components/ParallaxSection.tsx` | Parallax image dividers |

---

## Data Sources

### SmartPage API

Nito's pulls data from the **SmartPage API** (separate Shortlist product):

**Base URL:** `https://app.shortlistpass.com/api/smartpage`

#### Menu Items (Offerings)

**Endpoint:** `GET /api/smartpage/nitos/offerings`

**Response Structure:**
```json
{
  "business": {
    "name": "Nito's Empanadas",
    "subdomain": "nitos"
  },
  "offerings": {
    "byCategory": {
      "Savory": [
        {
          "id": "uuid",
          "title": "Beef Empanada",
          "description": "Seasoned ground beef with...",
          "price": 6,
          "category": "Savory"
        }
      ],
      "Sweet": [
        {
          "id": "uuid",
          "title": "Guava & Cheese",
          "description": "Sweet guava paste with...",
          "price": 4,
          "category": "Sweet"
        }
      ]
    }
  }
}
```

**Usage in MenuSection.tsx:**
```typescript
const response = await fetch(
  "https://app.shortlistpass.com/api/smartpage/nitos/offerings"
);
const data = await response.json();
const savoryItems = data.offerings.byCategory.Savory;
const sweetItems = data.offerings.byCategory.Sweet;
```

#### Locations (Food Truck Schedule)

**Endpoint:** `GET /api/smartpage/nitos/locations`

**Response Structure:**
```json
{
  "locations": [
    {
      "id": "uuid",
      "name": "Surfside Beach Pavilion",
      "address": "123 Ocean Blvd",
      "day_of_week": "Monday",
      "start_time": "11:00",
      "end_time": "15:00",
      "notes": "Weather permitting"
    }
  ]
}
```

**Usage in FoodTruckTimeline.tsx:**
```typescript
const response = await fetch(
  "https://app.shortlistpass.com/api/smartpage/nitos/locations"
);
const data = await response.json();
// Group by day_of_week for timeline display
```

---

## Game: Empanada Rush

The `/game` route features an arcade-style game.

### Game Mechanics
- **4 lanes** - Customers walk toward Damian from the left
- **Throw empanadas** - Hit customers before they reach you
- **Collect tips** - Move left/right to grab money dropped by satisfied customers
- **Level progression** - More customers per lane as level increases
- **Penalties** - Lose life if customer reaches you OR empanada misses everyone

### Key Game Constants (`GamePage.tsx`)
```typescript
const LANE_COUNT = 4;
const LANE_Y_POSITIONS = [42, 55, 68, 81]; // % from top for each lane
const DAMIAN_START_X = GAME_WIDTH - 100;   // Serving position (right side)
const EMPANADA_SPEED = 6;
const BASE_CUSTOMER_SPEED = 1.2;
const DAMIAN_MOVE_SPEED = 60;              // Left/right movement
const TIP_LIFETIME = 5000;                 // Tips vanish after 5 seconds
```

### Game Assets
- `/public/nitos-game-board.jpg` - Myrtle Beach boardwalk background
- `/public/damian-sneakers.png` - Damian character sprite
- `/public/empanada.png` - Empanada projectile
- `/public/sweet-empanada.png` - Sweet empanada variant

### Controls
- **Desktop:** Arrow keys or WASD + Spacebar
- **Mobile:** D-pad buttons + throw button

---

## Header Navigation

Links in `/clients/nitos/components/Header.tsx`:

| Label | Href | Type |
|-------|------|------|
| Home | `/` | Internal |
| Location | `#schedule` | Anchor |
| Menu | `#menu` | Anchor |
| About | `#about` | Anchor |
| Play | `/game` | Internal |
| My Assistant | `https://nitos.shortlistpass.com` | External |

---

## Static Assets

All in `/public/`:

| File | Description |
|------|-------------|
| `nitos-logo.avif` | Main logo |
| `nitos-truck.png` | Food truck image |
| `empanada-tower.png` | Stacked empanadas (savory menu) |
| `sweet-empanada.png` | Sweet empanada image |
| `empanada-paralax.png` | Parallax divider image |
| `nitos-name-behind-truck.png` | About section background |
| `damian-sneakers.png` | Damian character for game |
| `nitos-game-board.jpg` | Game background |

---

## Social Media

- **Instagram:** [@nitos_empanadasmb](https://www.instagram.com/nitos_empanadasmb/)
- **Facebook:** [Nito's Empanadas](https://www.facebook.com/profile.php?id=61564356566845)
- **TikTok:** [@nitos.empanadas](https://www.tiktok.com/@nitos.empanadas)

---

## Contact

- **Phone:** (843) 360-2235
- **Email:** nitosempanadas@yahoo.com
- **Location:** Myrtle Beach, SC (mobile food truck)
