export interface BudgetTiers {
  budget: number;
  mid: number;
  premium: number;
}

export interface MonthlyData {
  weatherScore: number;
  avgTempCelsius: number;
  rainyDays: number;
  crowdLevel: number;
  flightPriceIndex: number;
}

export interface PremiumContent {
  neighborhoodRecs: string[];
  areasToAvoid: string[];
  scamWarnings: string[];
  airportTransfer: {
    cheapest: string;
    fastest: string;
    recommended: string;
    taxiEstimate: string;
  };
  tippingEtiquette: string[];
  dailyCostBreakdown: {
    accommodation: string;
    meals: string;
    transport: string;
    activities: string;
  };
  packingTips: string[];
  bookingStrategy: string;
  localTips: string[];
  bestTimeToVisit: string;
  dayTrips: string[];
  visaInfo: string[];
  currencyTips: string[];
  simCard: string;
  emergencyNumbers: {
    police: string;
    ambulance: string;
    emergency: string;
  };
}

export interface CityProfile {
  id: string;
  city: string;
  country: string;
  region: string;
  currency: string;
  language: string;
  description: string;
  airportCode: string;

  foodScene: number;
  beachQuality: number;
  walkability: number;
  nightlife: number;
  safety: number;
  culturalDepth: number;
  transportationEase: number;
  englishFriendliness: number;
  familyFriendliness: number;
  soloFriendliness: number;
  coupleFriendliness: number;
  adventureActivities: number;
  shoppingScene: number;
  wellnessScene: number;
  digitalNomadScore: number;
  visaComplexity: number;
  instagrammability: number;
  affordability: number;
  localFriendliness: number;

  budgetTiers: BudgetTiers;
  monthlyData: MonthlyData[];

  premium: PremiumContent;

  shopUrl: string | null;

  lastUpdated: string;
  enabled: boolean;
}

export type ComparisonCategory =
  | "foodScene" | "beachQuality" | "walkability" | "nightlife" | "safety"
  | "culturalDepth" | "transportationEase" | "englishFriendliness"
  | "adventureActivities" | "instagrammability" | "affordability" | "localFriendliness";

export type TravelerWeights = Partial<Record<ComparisonCategory, number>>;

export interface TripContext {
  month: number;
  tripLengthDays: number;
  dailyBudget: number;
  travelType: "solo" | "couple" | "friends" | "family";
}

export interface CategoryScore {
  category: string;
  label: string;
  icon: string;
  score1: number;
  score2: number;
  weight: number;
  weighted1: number;
  weighted2: number;
  winner: "city1" | "city2" | "tie";
}

export interface SeasonalScore {
  category: string;
  label: string;
  icon: string;
  score1: number;
  score2: number;
  winner: "city1" | "city2" | "tie";
}

export interface ComparisonResult {
  city1: CityProfile;
  city2: CityProfile;
  tripContext: TripContext;
  weights: TravelerWeights;
  categoryScores: CategoryScore[];
  seasonalScores: SeasonalScore[];
  budgetFit1: number;
  budgetFit2: number;
  travelTypeFit1: number;
  travelTypeFit2: number;
  totalScore1: number;
  totalScore2: number;
  winner: "city1" | "city2" | "tie";
  verdictText: string;
  marginOfVictory: number;
}

export interface CityIndexEntry {
  id: string;
  city: string;
  country: string;
  region: string;
  enabled: boolean;
  budgetCategory: "budget" | "mid" | "premium";
}
