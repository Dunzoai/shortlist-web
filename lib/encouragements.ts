const blogEncouragements = [
  "Your words help families find their dream homes.",
  "Every post builds trust with future clients.",
  "Your expertise shines through your writing.",
  "Someone out there needs exactly what you're about to write.",
  "Your bilingual content reaches twice the hearts.",
  "Your authenticity is your brand's secret weapon.",
  "Today's post might be someone's first step home.",
  "Keep sharing your knowledge — it matters.",
  "You have a gift for making real estate feel approachable.",
  "Your voice makes a difference in this industry.",
  "Another opportunity to connect with your community.",
  "Your insights are helping someone make a big decision today.",
  "The best content comes from genuine expertise — like yours.",
  "You're building more than a blog — you're building trust.",
  "Your clients are lucky to have someone who cares this much.",
  "Great content takes time. You're worth the wait.",
  "Your perspective is what sets you apart.",
  "Every article plants a seed for future relationships.",
  "You make the complex feel simple — that's a rare skill.",
  "Your dedication to your craft is inspiring.",
  "The right words at the right time change everything.",
  "You're not just writing posts — you're opening doors."
];

const propertyEncouragements = [
  "Every listing is a family's future home.",
  "You're matching dreams with addresses.",
  "Your attention to detail makes all the difference.",
  "From global roots to local roofs.",
  "Someone's scrolling right now, looking for this home.",
  "The perfect buyer is out there for this one.",
  "You're not just listing homes — you're opening doors.",
  "Your market knowledge is what clients trust most.",
  "Every photo you choose tells a story.",
  "The right home finds the right family — you make that happen.",
  "Your listings reflect your standard of excellence.",
  "Behind every address is a new chapter waiting to begin.",
  "You see potential where others see walls and windows.",
  "Your care shows in every detail you capture.",
  "This could be the one someone's been searching for.",
  "You bring clarity to one of life's biggest decisions.",
  "Each property is a new opportunity to change a life.",
  "Your professionalism sets the tone from the first photo.",
  "Someone's dream home is waiting for your touch.",
  "You make the Grand Strand feel like home.",
  "Your listings don't just sell — they welcome.",
  "Every home has a story. You tell it beautifully."
];

// Get random encouragement without repeating recent ones
export function getRandomEncouragement(type: 'blog' | 'properties'): string {
  const messages = type === 'blog' ? blogEncouragements : propertyEncouragements;
  const storageKey = `encouragement_history_${type}`;

  // Get history from localStorage (client-side only)
  let history: number[] = [];
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Clean up entries older than 5 days
        const fiveDaysAgo = Date.now() - (5 * 24 * 60 * 60 * 1000);
        history = parsed.filter((entry: { index: number; timestamp: number }) =>
          entry.timestamp > fiveDaysAgo
        ).map((entry: { index: number }) => entry.index);
      }
    } catch (e) {
      history = [];
    }
  }

  // Get available indices (not used in last 5 days)
  const availableIndices = messages
    .map((_, index) => index)
    .filter(index => !history.includes(index));

  // If all have been used, reset and use any
  const indicesToChooseFrom = availableIndices.length > 0 ? availableIndices : messages.map((_, i) => i);

  // Pick random from available
  const randomIndex = indicesToChooseFrom[Math.floor(Math.random() * indicesToChooseFrom.length)];

  // Save to history
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(storageKey);
      let entries: { index: number; timestamp: number }[] = stored ? JSON.parse(stored) : [];
      entries.push({ index: randomIndex, timestamp: Date.now() });
      // Keep only last 5 days
      const fiveDaysAgo = Date.now() - (5 * 24 * 60 * 60 * 1000);
      entries = entries.filter(e => e.timestamp > fiveDaysAgo);
      localStorage.setItem(storageKey, JSON.stringify(entries));
    } catch (e) {
      // Ignore storage errors
    }
  }

  return messages[randomIndex];
}
