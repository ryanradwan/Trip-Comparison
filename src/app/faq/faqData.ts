export const FAQ_SECTIONS = [
  {
    title: "About the Tool",
    questions: [
      {
        q: "How does the Trip Comparison Engine work?",
        a: "You pick two cities, tell us about your trip (travel month, party type, budget, length), and adjust sliders to show what matters most to you — food, beaches, nightlife, safety, and more. Our algorithm weighs all of this against 18 scored data points per city and gives you a personalised winner with a detailed breakdown.",
      },
      {
        q: "How is the scoring calculated?",
        a: "Each city is scored across 18 categories (food scene, walkability, nightlife, safety, etc.). Your slider weights amplify the categories you care about most. We also factor in seasonal data for your travel month — weather score, crowd levels, and flight price index — to give you a score that reflects your specific trip, not just a generic ranking.",
      },
      {
        q: "Are the scores objective?",
        a: "The underlying data is research-based and updated regularly, but travel is personal. The sliders are there precisely because a digital nomad and a family with kids should not get the same result for Bangkok vs Bali. Use the scores as a structured framework, not gospel.",
      },
      {
        q: "Can I compare more than two cities at once?",
        a: "Right now the tool is designed for head-to-head comparisons — two cities at a time. If you're deciding between three cities, run two comparisons (A vs B, then the winner vs C) to find your best match.",
      },
    ],
  },
  {
    title: "Cities & Data",
    questions: [
      {
        q: "How many cities are available?",
        a: "We currently cover 48 destinations across Europe, Asia, the Americas, the Middle East, Africa, and Oceania. We add new cities every few months — if your destination isn't listed, check back or use our contact form to suggest it.",
      },
      {
        q: "How often is the data updated?",
        a: "City scores and premium content are reviewed and updated monthly. Seasonal data (weather, crowd levels, flight prices) is based on historical averages and updated seasonally. Visa and currency information is reviewed quarterly.",
      },
      {
        q: "Where does your data come from?",
        a: "Our scores are built from a combination of travel industry data, tourism board statistics, first-hand research, and regular editorial review by our travel team at The Next Stamp Travel Co. We cross-reference multiple sources and weight local expertise heavily.",
      },
      {
        q: "Why does a city have a score of 0 for beaches?",
        a: "A score of 0 means that category genuinely doesn't apply — landlocked cities, mountain destinations, and desert cities get 0 for beach quality, not because we forgot them, but because it's accurate. If beaches matter to you, slide that weight down so it doesn't unfairly penalise inland destinations.",
      },
    ],
  },
  {
    title: "Premium Breakdown",
    questions: [
      {
        q: "What's included in the Premium Breakdown?",
        a: "The Premium Breakdown unlocks a full insider guide for both cities, including: best neighbourhoods to stay, airport transfer options and costs, visa requirements, currency tips and best ATMs, SIM card advice, daily cost breakdowns, tipping etiquette, insider local tips, areas to avoid, scam warnings, day trip recommendations, packing tips, best time to visit, and emergency numbers. Plus a branded downloadable PDF of the full comparison.",
      },
      {
        q: "What's the difference between single and annual access?",
        a: "Single access ($5.99) unlocks the full premium breakdown for one specific city comparison. Annual access ($40/year) unlocks every comparison across all 48 cities for 12 months — the better value if you're planning multiple trips or comparing several options.",
      },
      {
        q: "Is there a refund policy?",
        a: "Yes — we offer a 7-day money-back guarantee on all purchases. If you're not happy with the premium content, email us within 7 days and we'll refund you in full, no questions asked.",
      },
      {
        q: "How do I access my premium breakdown after purchasing?",
        a: "After successful payment you'll be redirected back to your comparison page with premium access automatically unlocked. Access is stored in your browser — if you clear your browser data or switch devices, you'll need to contact us to restore access.",
      },
    ],
  },
  {
    title: "Planning Your Trip",
    questions: [
      {
        q: "What does the 'travel month' setting affect?",
        a: "Choosing your travel month pulls in monthly weather scores, average temperatures, rainy days, crowd levels, and flight price indexes for each city. A comparison for Bali in July looks very different from one in December — the seasonal data makes sure you're comparing the cities as they'll actually be when you visit.",
      },
      {
        q: "How should I set the daily budget?",
        a: "Enter what you actually plan to spend per person per day, excluding flights. This includes accommodation, food, transport, and activities. The tool compares your budget against each city's budget/mid/premium tiers and scores how well the city fits your spending level.",
      },
      {
        q: "The tool recommended City A but I feel City B is better — why?",
        a: "The algorithm reflects your slider inputs. If City B matches your gut, try nudging the sliders toward what draws you there — it may reveal that the tool agrees once your real priorities are reflected. Or trust your gut — the comparison is a decision aid, not a final answer.",
      },
      {
        q: "Do you cover visa requirements for all nationalities?",
        a: "The premium visa information covers the most common traveller nationalities (US, UK, EU, Canada, Australia) plus general guidance. For less common passports or complex situations, always verify directly with the destination country's official immigration authority before travelling.",
      },
    ],
  },
];
