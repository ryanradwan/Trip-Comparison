import { CityProfile, TripContext, TravelerWeights, ComparisonResult, CategoryScore, SeasonalScore } from "./types";
import { SLIDER_CATEGORIES } from "./constants";

function getBudgetFit(city: CityProfile, dailyBudget: number): number {
  const { budget, mid, premium } = city.budgetTiers;
  if (dailyBudget <= budget) return 10;
  if (dailyBudget <= mid) {
    // Scale between budget and mid
    const ratio = (dailyBudget - budget) / (mid - budget);
    return 10 - ratio * 2; // 10 → 8
  }
  if (dailyBudget <= premium) {
    return 8; // Comfortable
  }
  return 10; // Premium traveler, city is affordable
}

function getTravelTypeFit(city: CityProfile, travelType: TripContext["travelType"]): number {
  switch (travelType) {
    case "solo":    return city.soloFriendliness;
    case "couple":  return city.coupleFriendliness;
    case "friends": return (city.nightlife + city.soloFriendliness) / 2;
    case "family":  return city.familyFriendliness;
  }
}

function generateVerdict(
  city1: CityProfile,
  city2: CityProfile,
  total1: number,
  total2: number,
  _tripContext: TripContext,
  weights: TravelerWeights
): string {
  const margin = Math.abs(total1 - total2);
  const winner = total1 > total2 ? city1 : city2;
  const loser = total1 > total2 ? city2 : city1;
  const sameCountry = city1.country === city2.country;

  const topWeighted = SLIDER_CATEGORIES
    .filter((c) => (weights[c.key] ?? c.defaultWeight) > 60)
    .map((c) => c.label.toLowerCase());

  const strengthsList = topWeighted.length > 0
    ? ` especially for ${topWeighted.slice(0, 2).join(" and ")}`
    : "";

  const countryNote = sameCountry
    ? ` Since both cities are in ${city1.country}, there's no visa or currency difference — it purely comes down to your travel style.`
    : "";

  if (margin < 3) {
    return `It's extremely close — both ${city1.city} and ${city2.city} are excellent choices for your trip. With your current priorities${strengthsList}, ${winner.city} edges ahead by a hair. You genuinely can't go wrong with either.${countryNote}`;
  }

  if (margin < 8) {
    return `${winner.city} is the better fit for your trip${strengthsList}. It outperforms ${loser.city} across the categories you care most about, while still being a fantastic destination. ${loser.city} has its own strengths — if your priorities shift, it could easily take the top spot.${countryNote}`;
  }

  return `${winner.city} is the clear winner for your travel style${strengthsList}. It scores significantly higher across your top priorities. ${loser.city} is still worth considering for a different style of trip, but based on what matters to you, ${winner.city} is the stronger choice.${countryNote}`;
}

export function compareCities(
  city1: CityProfile,
  city2: CityProfile,
  tripContext: TripContext,
  weights: TravelerWeights
): ComparisonResult {
  const month = tripContext.month;

  // --- Category scores ---
  const categoryScores: CategoryScore[] = SLIDER_CATEGORIES.map((cat) => {
    const weight = weights[cat.key] ?? cat.defaultWeight;
    const s1 = city1[cat.key as keyof CityProfile] as number;
    const s2 = city2[cat.key as keyof CityProfile] as number;
    const w1 = (s1 * weight) / 100;
    const w2 = (s2 * weight) / 100;
    return {
      category: cat.key,
      label: cat.label,
      icon: cat.icon,
      score1: s1,
      score2: s2,
      weight,
      weighted1: w1,
      weighted2: w2,
      winner: w1 > w2 ? "city1" : w2 > w1 ? "city2" : "tie",
    };
  });

  // --- Seasonal scores ---
  const m1 = city1.monthlyData[month];
  const m2 = city2.monthlyData[month];

  const seasonalScores: SeasonalScore[] = [
    {
      category: "weather",
      label: "Weather",
      icon: "☀️",
      score1: m1.weatherScore,
      score2: m2.weatherScore,
      winner: m1.weatherScore > m2.weatherScore ? "city1" : m2.weatherScore > m1.weatherScore ? "city2" : "tie",
    },
    {
      category: "crowds",
      label: "Crowd Level",
      icon: "👥",
      score1: 10 - m1.crowdLevel, // invert: lower crowds = better score
      score2: 10 - m2.crowdLevel,
      winner: m1.crowdLevel < m2.crowdLevel ? "city1" : m2.crowdLevel < m1.crowdLevel ? "city2" : "tie",
    },
    {
      category: "flightPrice",
      label: "Flight Price",
      icon: "✈️",
      score1: 10 - m1.flightPriceIndex, // invert: lower price index = better
      score2: 10 - m2.flightPriceIndex,
      winner: m1.flightPriceIndex < m2.flightPriceIndex ? "city1" : m2.flightPriceIndex < m1.flightPriceIndex ? "city2" : "tie",
    },
  ];

  // --- Budget fit ---
  const budgetFit1 = getBudgetFit(city1, tripContext.dailyBudget);
  const budgetFit2 = getBudgetFit(city2, tripContext.dailyBudget);

  // --- Travel type fit ---
  const travelTypeFit1 = getTravelTypeFit(city1, tripContext.travelType);
  const travelTypeFit2 = getTravelTypeFit(city2, tripContext.travelType);

  // --- Total scores ---
  // Scoring formula weights — named constants to make the balance explicit
  const CATEGORY_WEIGHT_MULTIPLIER = 8;   // max contribution from weighted category scores
  const WEATHER_BONUS_MULTIPLIER   = 0.5; // max contribution: 10 * 0.5 = 5
  const BUDGET_BONUS_MULTIPLIER    = 0.3; // max contribution: 10 * 0.3 = 3
  const TRAVEL_BONUS_MULTIPLIER    = 0.3; // max contribution: 10 * 0.3 = 3
  // maxPossible = CATEGORY_WEIGHT_MULTIPLIER * 10 + max_weather + max_budget + max_travel
  const MAX_POSSIBLE_RAW = CATEGORY_WEIGHT_MULTIPLIER * 10 + 5 + 3 + 3;

  const weightedSum1 = categoryScores.reduce((sum, c) => sum + c.weighted1, 0);
  const weightedSum2 = categoryScores.reduce((sum, c) => sum + c.weighted2, 0);
  const maxWeightedSum = categoryScores.reduce((sum, c) => sum + (c.weight / 10), 0);

  const normalize = (val: number) => maxWeightedSum > 0 ? (val / maxWeightedSum) * 10 : 0;

  const weatherBonus1 = m1.weatherScore * WEATHER_BONUS_MULTIPLIER;
  const weatherBonus2 = m2.weatherScore * WEATHER_BONUS_MULTIPLIER;

  const budgetBonus1 = budgetFit1 * BUDGET_BONUS_MULTIPLIER;
  const budgetBonus2 = budgetFit2 * BUDGET_BONUS_MULTIPLIER;

  const travelBonus1 = travelTypeFit1 * TRAVEL_BONUS_MULTIPLIER;
  const travelBonus2 = travelTypeFit2 * TRAVEL_BONUS_MULTIPLIER;

  const rawTotal1 = normalize(weightedSum1) * CATEGORY_WEIGHT_MULTIPLIER + weatherBonus1 + budgetBonus1 + travelBonus1;
  const rawTotal2 = normalize(weightedSum2) * CATEGORY_WEIGHT_MULTIPLIER + weatherBonus2 + budgetBonus2 + travelBonus2;

  // Scale to 0-100
  const maxPossible = MAX_POSSIBLE_RAW;
  const totalScore1 = Math.round((rawTotal1 / maxPossible) * 100 * 10) / 10;
  const totalScore2 = Math.round((rawTotal2 / maxPossible) * 100 * 10) / 10;

  const winner = totalScore1 > totalScore2 ? "city1" : totalScore2 > totalScore1 ? "city2" : "tie";
  const marginOfVictory = Math.abs(totalScore1 - totalScore2);

  const verdictText = generateVerdict(city1, city2, totalScore1, totalScore2, tripContext, weights);

  return {
    city1,
    city2,
    tripContext,
    weights,
    categoryScores,
    seasonalScores,
    budgetFit1,
    budgetFit2,
    travelTypeFit1,
    travelTypeFit2,
    totalScore1,
    totalScore2,
    winner,
    verdictText,
    marginOfVictory,
  };
}
