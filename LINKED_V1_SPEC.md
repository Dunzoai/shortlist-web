# LINKED V1 — SPEC

## Overview
Linked is the social discovery layer of the Shortlist Pass 
consumer platform. It lives at me.shortlistpass.com and 
replaces the Community tab in the footer nav with a 
dedicated Linked tab. The goal is to connect neighbors 
around shared interests, local businesses, and community 
experiences — without feeling like a data collection exercise.

## Core Philosophy
- Opt-in always. Never forced.
- Every data point collected must feel like it benefits 
  the user immediately.
- The profile should feel like a magazine spread about 
  a real person — not a settings page.
- Behavioral data (orders, RSVPs, favorites) builds the 
  profile silently in the background.
- Self-reported data (interests, heritage, family) is 
  collected through a fun visual intake flow.

---

## 1. FOOTER NAV CHANGE

Replace the Community tab with Linked tab.

Current footer:
Home | Messages | Search | Activity | Community

New footer:
Home | Messages | Search | Activity | Linked

Community access moves to the Home feed as a 
"My Community" card that taps into their HOA SmartPage.

Icon for Linked tab: Lucide `Users` or custom 
connected nodes icon in mint green when active.

---

## 2. THE LINKED INTAKE FLOW

### Trigger
- First time a user taps the Linked tab they see 
  a welcome screen explaining the value
- Existing users see a "Complete your Linked profile" 
  prompt with a progress indicator
- Can be dismissed but resurfaces with a progress bar 
  showing what percentage is complete
- Never forced — always framed as a benefit to them

### Welcome Screen
Title: "Meet your neighbors"
Subtitle: "Tell us a little about yourself and we'll 
connect you with people nearby who share your world. 
Your info is only shared with people you choose."
CTA: "Let's go" or "Maybe later"

### Step 1 — Your vibe in one line
Not a text box. A single question:
"Finish this sentence: I'm known for..."
Tap chips to select up to 3:
- The food recommendations
- Knowing everyone
- Always at the events  
- The sports takes
- The neighborhood watch
- The friendly face
- The local explorer
- The connector

Fun, low stakes, sets the personality tone immediately.

### Step 2 — Where are you from?
Title: "Where do your roots go?"
Subtitle: "We use this to connect you with neighbors 
who share your background and find cultural events 
and food trucks you'll love."
Visual flag grid — tap to select origin.
Common selections pre-populated. Custom text entry available.
Multi-select allowed — mixed heritage welcome.

### Step 3 — Your people
Title: "Who's in your world?"
Visual tap cards with icons:
- Just me
- Me and my partner
- Family with kids
- Empty nester
- New to the area
- Single parent

If they tap Family with kids or Single parent:
A friendly follow up appears:
"How old are your kids?"
Age range chips: Under 2, 2-5, 6-10, 11-14, 15-18

### Step 4 — Your teams
Title: "Who do you bleed for?"
Sport category chips first: NFL, NBA, MLB, NHL, 
College Football, College Basketball, Soccer, MMA, Golf
When they tap a sport — team logos appear for that sport.
They tap their team. It locks in with a mint green highlight.
Multi-sport supported.

### Step 5 — Your vibe
Title: "What does your ideal weekend look like?"
Full bleed photo cards they tap — not just text:
- Craft beer and live music photo
- Game day watch party photo
- Farmer's market and coffee photo
- Beach and outdoor adventure photo
- Food festival and trying new things photo
- Fitness and early mornings photo
- Family activities and kids events photo
- Wine and fine dining photo
Multi-select. Tap to select, tap again to deselect.

### Step 6 — Your food world
Title: "What's always on your table?"
Visual food category chips with icons:
BBQ, Mediterranean, Latin/Caribbean, Asian fusion, 
Southern comfort, Seafood, Vegan/plant-based, 
Spicy everything, Pizza obsessed, Brunch person
Multi-select.

### Step 7 — Drop a photo (optional)
Title: "Show us your world"
Subtitle: "Add a photo that says something about you — 
game day gear, your Saturday morning, your people. 
Totally optional but it makes your profile come alive."
Upload button. Skip option clearly visible.
Photo crops to square for profile display.

### The Reveal
After completing steps — animate the profile card 
assembling in real time.
System generates bold personality headlines from their inputs.
Shows them what their profile looks like to neighbors.
Two CTAs:
- "Share my profile" — generates trading card
- "Find my people" — takes them to discovery

---

## 3. PROFILE PAGE REDESIGN

### Header (existing — keep)
- Avatar
- Name
- Friends count, Lists count, Favorites count
- Bio (editable)
- Location
- Link
- Edit profile / Share profile buttons

### New sections below header — scrollable:

#### Personality Headlines
System generates bold statements from intake data.
Each headline is:
- Large bold text — the system generated statement
  Example: "Huge 49ers fan"
- Editable annotation below in smaller text
  Example: tap to add "Lifelong since 1984 — 
  Mike Evans is bringing us the trophy"
- Optional photo attached to this section
- Mint green accent line on the left like a pull quote

Headlines generated from:
- Sports: "Huge [team] fan"
- Heritage: "Proud [origin] roots"
- Family: "Dad/Mom of [x] kids" or "Empty nester 
  living their best life"
- Vibe: "Always at the best local spots"
- Food: "Will drive across town for good [cuisine]"

User can reorder headlines by drag and drop.
User can edit the system text entirely.
User can hide any headline from public view.

#### Business Love — horizontal scroll sections
One section per business they've favorited or ordered from repeatedly.
Section header: "Big fan of [Business Name]" — 
tappable, opens SmartPage
Below: horizontal swipe of photos they've added 
from visits, ordered by most recent
If no photos yet: placeholder card saying 
"Add a photo from your next visit"
Tag the business on each photo automatically.

#### Tabs (existing grid, heart, activity icons)
Keep existing tab structure below business sections.
Grid tab: general photo moments not tied to a business
Heart tab: favorited businesses and events
Activity tab: orders, RSVPs, connections

#### People Like You
A section on the profile page — not in community tab.
Title: "Your people"
Shows 3-5 profile cards of neighbors with highest 
interest overlap with the viewer.
Each card shows: avatar, name, top 2 shared interests, 
community they're in, Connect button.
Ranked by: number of shared interest tags first, 
then proximity by community.
Only shows users who have opted into Linked 
and set profile to public or connections.

---

## 4. THE TRADING CARD

Generated when user taps "Share profile."

Two outputs:

### A. Shareable Image Card
Instagram story sized — 1080x1920.
Dark background with mint green accents.
Contains:
- Their avatar
- Their name and community
- Their top 3 interest chips with icons
- Their sports team color bleeding into the background
- "Find me on Shortlist Pass" with QR code to their profile
- Shortlist Pass logo bottom right

Generated as a downloadable PNG.
One tap to share to Instagram, iMessage, etc.

### B. Public Profile Link
me.shortlistpass.com/linked/[username]
Public facing profile page.
Shows personality headlines, business love sections, 
shared interest chips.
Non-logged-in visitors see a CTA: 
"Connect with [name] on Shortlist Pass"
Drives new user acquisition from shares.

---

## 5. DISCOVERY PAGE

Accessed from the Linked footer tab.

### Home State (not yet connected to many people)
Shows:
- Their profile completion percentage
- "People like you nearby" — interest matched neighbors
- "In your community" — other Linked users 
  in their HOA community
- "New to the network" — recently joined users nearby

### Filter Options
Horizontal filter chips at top:
- All
- My community
- [Sport team name] fans
- [Food interest]
- Families with kids
- New to the area

When they tap 49ers — all 49ers fan profiles 
in the network populate as cards.
Ranked by: shared interests with the viewer first, 
then community proximity.

### Profile Cards in Discovery
- Avatar
- Name
- Community they're in
- Top 2-3 shared interest chips highlighted in mint green
- Connect button
- Tap card to view full profile

---

## 6. DATABASE TABLES

### consumer_profile_details
- consumer_id (FK to smartpage_consumers)
- display_name
- hometown
- origin (array — supports multiple heritage)
- occupation
- family_status
- children (JSONB: [{age: 6}, {age: 9}])
- bio
- avatar_url
- cover_image_url
- vibe_chips (array — from step 1)
- linked_opted_in (boolean default false)
- profile_visibility (public, connections, private)
- profile_complete (boolean)
- created_at
- updated_at

### consumer_interests
- consumer_id (FK)
- category (sports, food, music, fitness, family, culture)
- value (49ers, craft beer, Mediterranean etc)
- source (self_reported or behavioral)
- created_at

### consumer_business_moments
- consumer_id (FK)
- business_id (FK)
- photo_url
- caption (optional)
- visit_date
- created_at

### consumer_connections
- requester_id (FK)
- receiver_id (FK)
- status (pending, accepted, declined)
- match_reason (shared interest tag)
- created_at

### consumer_profile_headlines
- consumer_id (FK)
- headline_text (system generated, editable)
- annotation_text (user added)
- photo_url (optional)
- display_order
- is_visible (boolean)
- created_at

---

## 7. PAGES TO BUILD

### me.shortlistpass.com/me/linked
The intake flow — step by step visual journey.
Only shown to users who haven't completed Linked profile.
After completion redirects to their profile.

### me.shortlistpass.com/me/profile (redesign)
Add personality headlines section.
Add business love horizontal scroll sections.
Add People Like You section.
Keep existing tabs.

### me.shortlistpass.com/linked
Discovery page with filters.
Profile cards grid.
Search by interest.

### me.shortlistpass.com/linked/[username]
Public profile page.
Personality headlines.
Business love sections.
Shared interests highlighted.
Connect CTA for logged in users.
Sign up CTA for non-users.

---

## 8. V1 SCOPE — WHAT WE ARE NOT BUILDING YET

- Real time messaging between connections 
  (Messages tab already handles this)
- Group chats around interests
- Event co-attendance notifications
- The magazine personalization based on Linked data
- Geofencing coupon delivery based on profile
- Spotify or social media import for interest auto-fill
- Verified badges for long-term residents

All of the above are V2 and beyond.

---

## 9. PRIVACY PRINCIPLES

- Every field is optional except name
- Profile visibility toggle: public, connections only, private
- Linked opt-in is explicit and explained clearly
- Behavioral data (orders, RSVPs) only used for 
  profile enrichment if linked_opted_in is true
- Users can delete all Linked data at any time 
  from profile settings
- No data is ever sold or shared with third parties
- Clear one-line explanation on every intake step 
  explaining why we're asking and how it helps them

---

## 10. SUCCESS METRICS FOR V1

- Linked profile completion rate (target 60%+)
- Connection request rate (target 1+ per active user per week)
- Trading card share rate (target 20%+ of completed profiles)
- Discovery page daily active usage
- New user signups from shared profile links
