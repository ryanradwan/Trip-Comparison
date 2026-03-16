export const SLIDER_CATEGORIES = [
  { key: "foodScene",           label: "Food Scene",         icon: "🍽️", defaultWeight: 50 },
  { key: "beachQuality",        label: "Beach Quality",      icon: "🏖️", defaultWeight: 50 },
  { key: "walkability",         label: "Walkability",        icon: "🚶", defaultWeight: 50 },
  { key: "nightlife",           label: "Nightlife",          icon: "🌙", defaultWeight: 30 },
  { key: "safety",              label: "Safety",             icon: "🛡️", defaultWeight: 70 },
  { key: "culturalDepth",       label: "Culture & History",  icon: "🏛️", defaultWeight: 50 },
  { key: "transportationEase",  label: "Getting Around",     icon: "🚇", defaultWeight: 50 },
  { key: "englishFriendliness", label: "English Friendly",   icon: "🗣️", defaultWeight: 40 },
  { key: "adventureActivities", label: "Adventure",          icon: "🧗", defaultWeight: 30 },
  { key: "instagrammability",   label: "Instagrammability",  icon: "📸", defaultWeight: 30 },
  { key: "affordability",       label: "Affordability",      icon: "💰", defaultWeight: 60 },
  { key: "localFriendliness",   label: "Local Friendliness", icon: "🤝", defaultWeight: 50 },
] as const;

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
] as const;

export const TRAVEL_TYPES = [
  { value: "solo" as const,    label: "Solo",    icon: "🧳" },
  { value: "couple" as const,  label: "Couple",  icon: "💑" },
  { value: "friends" as const, label: "Friends", icon: "👯" },
  { value: "family" as const,  label: "Family",  icon: "👨‍👩‍👧‍👦" },
] as const;

export const TRAVELER_PROFILES = [
  {
    id: "backpacker",
    label: "Budget Backpacker",
    icon: "🎒",
    weights: { affordability: 95, safety: 65, walkability: 75, transportationEase: 75, foodScene: 55, nightlife: 45, culturalDepth: 50, englishFriendliness: 40, beachQuality: 30, adventureActivities: 50, instagrammability: 20, localFriendliness: 60 },
  },
  {
    id: "nomad",
    label: "Digital Nomad",
    icon: "💻",
    weights: { walkability: 85, transportationEase: 85, affordability: 85, foodScene: 65, safety: 65, englishFriendliness: 70, culturalDepth: 40, nightlife: 30, beachQuality: 30, adventureActivities: 30, instagrammability: 25, localFriendliness: 55 },
  },
  {
    id: "luxury",
    label: "Luxury Traveller",
    icon: "✨",
    weights: { foodScene: 85, safety: 75, culturalDepth: 75, instagrammability: 65, beachQuality: 60, walkability: 55, englishFriendliness: 60, transportationEase: 50, nightlife: 45, affordability: 15, adventureActivities: 35, localFriendliness: 50 },
  },
  {
    id: "family",
    label: "Family",
    icon: "👨‍👩‍👧‍👦",
    weights: { safety: 95, englishFriendliness: 85, walkability: 75, foodScene: 65, transportationEase: 65, culturalDepth: 55, affordability: 60, beachQuality: 50, nightlife: 10, adventureActivities: 45, instagrammability: 25, localFriendliness: 55 },
  },
  {
    id: "solo-female",
    label: "Solo Female",
    icon: "🌸",
    weights: { safety: 100, localFriendliness: 75, englishFriendliness: 75, walkability: 65, transportationEase: 65, affordability: 60, foodScene: 55, culturalDepth: 50, nightlife: 30, beachQuality: 35, adventureActivities: 35, instagrammability: 30 },
  },
  {
    id: "honeymoon",
    label: "Honeymoon",
    icon: "💑",
    weights: { beachQuality: 85, foodScene: 85, instagrammability: 75, culturalDepth: 65, nightlife: 55, safety: 65, walkability: 55, englishFriendliness: 50, localFriendliness: 55, affordability: 30, transportationEase: 45, adventureActivities: 40 },
  },
] as const;

export const BUDGET_PRESETS = [
  { value: 50,  label: "Budget",    sublabel: "$30–80/day" },
  { value: 130, label: "Mid-Range", sublabel: "$80–200/day" },
  { value: 300, label: "Premium",   sublabel: "$200+/day" },
] as const;

// Factory function so month is computed at call time, not module load time
export function getDefaultTripContext() {
  return {
    month: new Date().getMonth(),
    tripLengthDays: 7,
    dailyBudget: 130,
    travelType: "couple" as const,
  };
}

// Static fallback for server-side contexts where dynamic month is irrelevant
export const DEFAULT_TRIP_CONTEXT = {
  month: 5, // June — reasonable year-round default
  tripLengthDays: 7,
  dailyBudget: 130,
  travelType: "couple" as const,
};
