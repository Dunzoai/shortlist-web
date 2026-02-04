# Event Template Images

Add your images to this folder. The EventsCalendar component will automatically match events to these images based on keywords in the event title.

## Required Images:

- **live-music.jpg** - Triggered by: "music", "band", "live", "concert"
- **thirsty-thursday.jpg** - Triggered by: "thirsty thursday", "$3"
- **wine-wednesday.jpg** - Triggered by: "wine wednesday", "wine"
- **teal-tuesday.jpg** - Triggered by: "teal tuesday", "coastal carolina"
- **food.jpg** - Triggered by: "burger", "food", "smash", "kitchen"
- **trivia.jpg** - Triggered by: "trivia", "quiz", "game night"
- **cigars.jpg** - Triggered by: "cigar", "humidor", "smoke"
- **tasting.jpg** - Triggered by: "tasting", "flight", "sample", "brewery"
- **default.jpg** - Fallback for any event that doesn't match above

## Recommended Image Specs:
- Dimensions: 800x600px or similar landscape ratio
- Format: JPG or PNG
- Keep file sizes under 500KB for fast loading

## How It Works:
1. You create an event in SmartPage dashboard
2. Event title includes a keyword (e.g., "Live Music Friday")
3. Website automatically shows it with the corresponding image
4. If no keyword match → uses default.jpg

## To Add More Templates:
Edit `/clients/palmetto_taps/components/EventsCalendar.tsx` and add to the `eventTemplates` object.
