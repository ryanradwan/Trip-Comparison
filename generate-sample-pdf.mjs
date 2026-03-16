import { pdf, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { createElement as el } from "react";
import { readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const dubai = JSON.parse(readFileSync("./src/data/cities/dubai.json", "utf8"));
const luxor = JSON.parse(readFileSync("./src/data/cities/luxor.json", "utf8"));

// Trip context: couple trip in November, 7 days, $150/day
const tripContext = { month: 10, tripLengthDays: 7, dailyBudget: 150, travelType: "couple" };
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const CATEGORIES = [
  { key: "foodScene", label: "Food Scene", icon: "🍽️", defaultWeight: 60 },
  { key: "beachQuality", label: "Beach Quality", icon: "🏖️", defaultWeight: 50 },
  { key: "walkability", label: "Walkability", icon: "🚶", defaultWeight: 55 },
  { key: "nightlife", label: "Nightlife", icon: "🎉", defaultWeight: 45 },
  { key: "safety", label: "Safety", icon: "🛡️", defaultWeight: 70 },
  { key: "culturalDepth", label: "Cultural Depth", icon: "🏛️", defaultWeight: 60 },
  { key: "transportationEase", label: "Transportation", icon: "🚇", defaultWeight: 55 },
  { key: "englishFriendliness", label: "English Friendly", icon: "💬", defaultWeight: 50 },
  { key: "adventureActivities", label: "Adventure", icon: "🧗", defaultWeight: 50 },
  { key: "instagrammability", label: "Instagrammability", icon: "📸", defaultWeight: 45 },
];

function getBudgetFit(city, dailyBudget) {
  const { budget, mid, premium } = city.budgetTiers;
  if (dailyBudget <= budget) return 10;
  if (dailyBudget <= mid) return 10 - ((dailyBudget - budget) / (mid - budget)) * 2;
  if (dailyBudget <= premium) return 8;
  return 10;
}

const categoryScores = CATEGORIES.map((cat) => {
  const s1 = dubai[cat.key];
  const s2 = luxor[cat.key];
  const w = cat.defaultWeight;
  const w1 = (s1 * w) / 100;
  const w2 = (s2 * w) / 100;
  return { ...cat, score1: s1, score2: s2, weight: w, weighted1: w1, weighted2: w2,
    winner: w1 > w2 ? "city1" : w2 > w1 ? "city2" : "tie" };
});

const m1 = dubai.monthlyData[tripContext.month];
const m2 = luxor.monthlyData[tripContext.month];
const budgetFit1 = getBudgetFit(dubai, tripContext.dailyBudget);
const budgetFit2 = getBudgetFit(luxor, tripContext.dailyBudget);
const travelFit1 = dubai.coupleFriendliness;
const travelFit2 = luxor.coupleFriendliness;

const ws1 = categoryScores.reduce((s, c) => s + c.weighted1, 0);
const ws2 = categoryScores.reduce((s, c) => s + c.weighted2, 0);
const maxWS = categoryScores.reduce((s, c) => s + c.weight / 10, 0);
const norm = (v) => maxWS > 0 ? (v / maxWS) * 10 : 0;

const raw1 = norm(ws1)*8 + m1.weatherScore*0.5 + budgetFit1*0.3 + travelFit1*0.3;
const raw2 = norm(ws2)*8 + m2.weatherScore*0.5 + budgetFit2*0.3 + travelFit2*0.3;
const maxP = 91;
const total1 = Math.round((raw1/maxP)*1000)/10;
const total2 = Math.round((raw2/maxP)*1000)/10;
const margin = Math.abs(total1 - total2);
const winner = total1 > total2 ? "city1" : "city2";
const winnerCity = winner === "city1" ? dubai : luxor;
const loserCity = winner === "city1" ? luxor : dubai;
const verdictText = `${winnerCity.city} is the better fit for your couple trip in November. It outperforms ${loserCity.city} across the categories you care most about — particularly safety, English-friendliness, and food scene — while offering a world-class hospitality experience. ${loserCity.city} has extraordinary cultural depth and is the superior choice for history-focused travellers, but for a balanced couple trip, ${winnerCity.city} edges ahead.`;
const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
const monthName = MONTHS[tripContext.month];

// ── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: { backgroundColor: "#FAF7F2", padding: 40, fontFamily: "Helvetica" },
  header: { backgroundColor: "#7B5E43", padding: 20, marginBottom: 20, borderRadius: 8 },
  headerTitle: { color: "#FFFFFF", fontSize: 22, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  headerSub: { color: "#F3E8DA", fontSize: 10 },
  sectionTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#7B5E43", marginBottom: 6, marginTop: 14, borderBottomWidth: 1, borderBottomColor: "#D8C2A7", paddingBottom: 3 },
  tableHeader: { flexDirection: "row", backgroundColor: "#7B5E43", padding: 7, marginBottom: 1 },
  tableHeaderText: { color: "#FFFFFF", fontSize: 9, fontFamily: "Helvetica-Bold", flex: 1 },
  tableRow: { flexDirection: "row", padding: 5, borderBottomWidth: 1, borderBottomColor: "#F3E8DA" },
  tableCell: { flex: 1, fontSize: 9, color: "#5C4A38" },
  tableCellBold: { flex: 1, fontSize: 9, color: "#A1785A", fontFamily: "Helvetica-Bold" },
  bullet: { fontSize: 9, color: "#5C4A38", marginBottom: 3, paddingLeft: 8, lineHeight: 1.5 },
  verdictBox: { backgroundColor: "#F3E8DA", borderWidth: 1, borderColor: "#D8C2A7", padding: 14, borderRadius: 6, marginTop: 12 },
  verdictTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#A1785A", marginBottom: 5 },
  verdictText: { fontSize: 9, color: "#5C4A38", lineHeight: 1.6 },
  footer: { position: "absolute", bottom: 20, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#D8C2A7", paddingTop: 5 },
  footerText: { fontSize: 7, color: "#BFA38A" },
  cityHeader: { backgroundColor: "#F3E8DA", padding: 10, borderRadius: 4, marginBottom: 8 },
  cityName: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#7B5E43" },
  cityCountry: { fontSize: 9, color: "#BFA38A", marginTop: 2 },
  bodyText: { fontSize: 9, color: "#5C4A38", lineHeight: 1.5 },
  labelValue: { flexDirection: "row", marginBottom: 4 },
  labelText: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#BFA38A", width: 90 },
  valueText: { fontSize: 8, color: "#5C4A38", flex: 1, lineHeight: 1.5 },
  backPage: { backgroundColor: "#7B5E43", flex: 1, padding: 60, alignItems: "center", justifyContent: "center" },
  backTitle: { color: "#FAF7F2", fontSize: 24, fontFamily: "Helvetica-Bold", textAlign: "center", marginBottom: 16 },
  backSub: { color: "#D8C2A7", fontSize: 12, textAlign: "center", marginBottom: 20, lineHeight: 1.6 },
  backUrl: { color: "#F3E8DA", fontSize: 13, fontFamily: "Helvetica-Bold", textAlign: "center" },
  scoreRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 10, marginBottom: 8 },
  scoreBox: { alignItems: "center", flex: 1 },
  scoreBig: { fontSize: 36, fontFamily: "Helvetica-Bold", color: "#A1785A", lineHeight: 1 },
  scoreCity: { fontSize: 10, color: "#5C4A38", marginTop: 3 },
  tripSummaryBox: { backgroundColor: "#F3E8DA", borderRadius: 5, padding: "8 12", marginBottom: 14, flexDirection: "row", justifyContent: "space-between" },
  tripSummaryItem: { alignItems: "center" },
  tripSummaryLabel: { fontSize: 7, color: "#BFA38A", fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.5 },
  tripSummaryValue: { fontSize: 10, color: "#5C4A38", fontFamily: "Helvetica-Bold", marginTop: 2 },
});

function CitySection(city, premium) {
  return el(View, null,
    el(View, { style: styles.cityHeader },
      el(Text, { style: styles.cityName }, city.city),
      el(Text, { style: styles.cityCountry }, `${city.country} · ${city.language} · ${city.currency}`)
    ),

    el(Text, { style: styles.sectionTitle }, "Best Neighbourhoods to Stay"),
    ...premium.neighborhoodRecs.map((n, i) => el(Text, { key: i, style: styles.bullet }, `• ${n}`)),

    el(Text, { style: styles.sectionTitle }, "Visa Information"),
    ...premium.visaInfo.map((v, i) => el(Text, { key: i, style: styles.bullet }, `• ${v}`)),

    el(Text, { style: styles.sectionTitle }, "Airport Transfer"),
    el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Cheapest"), el(Text, { style: styles.valueText }, premium.airportTransfer.cheapest)),
    el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Fastest"), el(Text, { style: styles.valueText }, premium.airportTransfer.fastest)),
    el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Recommended"), el(Text, { style: styles.valueText }, premium.airportTransfer.recommended)),
    el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Taxi estimate"), el(Text, { style: styles.valueText }, premium.airportTransfer.taxiEstimate)),

    el(Text, { style: styles.sectionTitle }, "Currency & Money Tips"),
    ...premium.currencyTips.map((c, i) => el(Text, { key: i, style: styles.bullet }, `• ${c}`)),

    el(Text, { style: styles.sectionTitle }, "SIM Card & Connectivity"),
    el(Text, { style: styles.bullet }, premium.simCard),

    el(Text, { style: styles.sectionTitle }, "Daily Cost Breakdown"),
    el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Accommodation"), el(Text, { style: styles.valueText }, premium.dailyCostBreakdown.accommodation)),
    el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Meals"), el(Text, { style: styles.valueText }, premium.dailyCostBreakdown.meals)),
    el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Transport"), el(Text, { style: styles.valueText }, premium.dailyCostBreakdown.transport)),
    el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Activities"), el(Text, { style: styles.valueText }, premium.dailyCostBreakdown.activities)),

    el(Text, { style: styles.sectionTitle }, "Tipping & Etiquette"),
    ...premium.tippingEtiquette.map((t, i) => el(Text, { key: i, style: styles.bullet }, `• ${t}`)),

    el(Text, { style: styles.sectionTitle }, "Insider Tips"),
    ...premium.localTips.map((t, i) => el(Text, { key: i, style: styles.bullet }, `• ${t}`)),

    el(Text, { style: styles.sectionTitle }, "Areas to Avoid"),
    ...premium.areasToAvoid.map((a, i) => el(Text, { key: i, style: styles.bullet }, `• ${a}`)),

    el(Text, { style: styles.sectionTitle }, "Scam Warnings"),
    ...premium.scamWarnings.map((s, i) => el(Text, { key: i, style: styles.bullet }, `• ${s}`)),

    el(Text, { style: styles.sectionTitle }, "Day Trips"),
    ...premium.dayTrips.map((d, i) => el(Text, { key: i, style: styles.bullet }, `• ${d}`)),

    el(Text, { style: styles.sectionTitle }, "Best Time to Visit"),
    el(Text, { style: styles.bullet }, premium.bestTimeToVisit),

    el(Text, { style: styles.sectionTitle }, "Packing Tips"),
    ...premium.packingTips.map((p, i) => el(Text, { key: i, style: styles.bullet }, `• ${p}`)),

    el(Text, { style: styles.sectionTitle }, "Booking Strategy"),
    el(Text, { style: styles.bullet }, premium.bookingStrategy),

    el(Text, { style: styles.sectionTitle }, "Emergency Numbers"),
    el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Police"), el(Text, { style: styles.valueText }, premium.emergencyNumbers.police)),
    el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Ambulance"), el(Text, { style: styles.valueText }, premium.emergencyNumbers.ambulance)),
    el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "General"), el(Text, { style: styles.valueText }, premium.emergencyNumbers.emergency)),
  );
}

const doc = el(Document, { title: "Dubai vs Luxor — Trip Comparison Report", author: "The Next Stamp Travel Co." },

  // ── Page 1: Summary ──────────────────────────────────────────────────────
  el(Page, { size: "A4", style: styles.page },
    el(View, { style: styles.header },
      el(Text, { style: styles.headerTitle }, "Dubai vs Luxor"),
      el(Text, { style: styles.headerSub }, "Trip Comparison Report · The Next Stamp Travel Co.")
    ),

    // Trip summary bar
    el(View, { style: styles.tripSummaryBox },
      el(View, { style: styles.tripSummaryItem },
        el(Text, { style: styles.tripSummaryLabel }, "Travel Month"),
        el(Text, { style: styles.tripSummaryValue }, monthName)
      ),
      el(View, { style: styles.tripSummaryItem },
        el(Text, { style: styles.tripSummaryLabel }, "Trip Length"),
        el(Text, { style: styles.tripSummaryValue }, `${tripContext.tripLengthDays} days`)
      ),
      el(View, { style: styles.tripSummaryItem },
        el(Text, { style: styles.tripSummaryLabel }, "Daily Budget"),
        el(Text, { style: styles.tripSummaryValue }, `$${tripContext.dailyBudget}/day`)
      ),
      el(View, { style: styles.tripSummaryItem },
        el(Text, { style: styles.tripSummaryLabel }, "Travel Type"),
        el(Text, { style: styles.tripSummaryValue }, "Couple")
      ),
    ),

    // Score display
    el(View, { style: styles.scoreRow },
      el(View, { style: styles.scoreBox },
        el(Text, { style: { ...styles.scoreCity, marginBottom: 4 } }, "Dubai"),
        el(Text, { style: { ...styles.scoreBig, color: winner === "city1" ? "#A1785A" : "#BFA38A" } }, total1.toFixed(1)),
        winner === "city1" ? el(Text, { style: { fontSize: 9, color: "#A1785A", fontFamily: "Helvetica-Bold", marginTop: 4 } }, "✓ WINNER") : el(Text, { style: { fontSize: 9, color: "#BFA38A", marginTop: 4 } }, " ")
      ),
      el(View, { style: { alignItems: "center", justifyContent: "center", paddingTop: 8 } },
        el(Text, { style: { fontSize: 14, color: "#D8C2A7", fontFamily: "Helvetica-Bold" } }, "VS")
      ),
      el(View, { style: styles.scoreBox },
        el(Text, { style: { ...styles.scoreCity, marginBottom: 4 } }, "Luxor"),
        el(Text, { style: { ...styles.scoreBig, color: winner === "city2" ? "#A1785A" : "#BFA38A" } }, total2.toFixed(1)),
        winner === "city2" ? el(Text, { style: { fontSize: 9, color: "#A1785A", fontFamily: "Helvetica-Bold", marginTop: 4 } }, "✓ WINNER") : el(Text, { style: { fontSize: 9, color: "#BFA38A", marginTop: 4 } }, " ")
      ),
    ),

    el(Text, { style: styles.sectionTitle }, `Seasonal Snapshot — ${monthName}`),
    el(View, { style: styles.tableHeader },
      el(Text, { style: styles.tableHeaderText }, "Category"),
      el(Text, { style: styles.tableHeaderText }, "Dubai"),
      el(Text, { style: styles.tableHeaderText }, "Luxor"),
    ),
    ...[
      ["Weather Score", `${m1.weatherScore}/10`, `${m2.weatherScore}/10`, m1.weatherScore >= m2.weatherScore],
      ["Avg Temperature", `${m1.avgTempCelsius}°C`, `${m2.avgTempCelsius}°C`, false],
      ["Rainy Days", `${m1.rainyDays} days`, `${m2.rainyDays} days`, m1.rainyDays <= m2.rainyDays],
      ["Crowd Level", `${m1.crowdLevel}/10`, `${m2.crowdLevel}/10`, m1.crowdLevel <= m2.crowdLevel],
      ["Flight Price Index", `${m1.flightPriceIndex}/10`, `${m2.flightPriceIndex}/10`, m1.flightPriceIndex <= m2.flightPriceIndex],
    ].map(([label, v1, v2, c1wins], i) =>
      el(View, { key: i, style: { ...styles.tableRow, backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#FAF7F2" } },
        el(Text, { style: styles.tableCell }, label),
        el(Text, { style: c1wins ? styles.tableCellBold : styles.tableCell }, v1),
        el(Text, { style: !c1wins ? styles.tableCellBold : styles.tableCell }, v2),
      )
    ),

    el(Text, { style: styles.sectionTitle }, "Score Comparison by Category"),
    el(View, { style: styles.tableHeader },
      el(Text, { style: styles.tableHeaderText }, "Category"),
      el(Text, { style: styles.tableHeaderText }, "Dubai"),
      el(Text, { style: styles.tableHeaderText }, "Luxor"),
    ),
    ...categoryScores.map((cat, i) =>
      el(View, { key: i, style: { ...styles.tableRow, backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#FAF7F2" } },
        el(Text, { style: styles.tableCell }, `${cat.icon} ${cat.label}`),
        el(Text, { style: cat.winner === "city1" ? styles.tableCellBold : styles.tableCell }, `${cat.score1}/10`),
        el(Text, { style: cat.winner === "city2" ? styles.tableCellBold : styles.tableCell }, `${cat.score2}/10`),
      )
    ),

    el(View, { style: styles.verdictBox },
      el(Text, { style: styles.verdictTitle }, `Winner: ${winnerCity.city} (by ${margin.toFixed(1)} points)`),
      el(Text, { style: styles.verdictText }, verdictText),
    ),

    el(View, { style: styles.footer },
      el(Text, { style: styles.footerText }, `Generated ${today} · Couple trip · ${monthName} · 7 days · $150/day`),
      el(Text, { style: styles.footerText }, "thenextstamptravelco.com"),
    ),
  ),

  // ── Page 2: Dubai ────────────────────────────────────────────────────────
  el(Page, { size: "A4", style: styles.page },
    el(Text, { style: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#7B5E43", marginBottom: 14 } }, "Full Insider Breakdown: Dubai"),
    CitySection(dubai, dubai.premium),
    el(View, { style: styles.footer },
      el(Text, { style: styles.footerText }, "The Next Stamp Travel Co."),
      el(Text, { style: styles.footerText }, "thenextstamptravelco.com"),
    ),
  ),

  // ── Page 3: Luxor ────────────────────────────────────────────────────────
  el(Page, { size: "A4", style: styles.page },
    el(Text, { style: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#7B5E43", marginBottom: 14 } }, "Full Insider Breakdown: Luxor"),
    CitySection(luxor, luxor.premium),
    el(View, { style: styles.footer },
      el(Text, { style: styles.footerText }, "The Next Stamp Travel Co."),
      el(Text, { style: styles.footerText }, "thenextstamptravelco.com"),
    ),
  ),

  // ── Page 4: Back cover ───────────────────────────────────────────────────
  el(Page, { size: "A4", style: { ...styles.page, padding: 0 } },
    el(View, { style: styles.backPage },
      el(Text, { style: styles.backTitle }, "Ready to book your trip?"),
      el(Text, { style: styles.backSub }, "Visit The Next Stamp Travel Co. for curated day-by-day\nitineraries, custom trip planning, and expert travel guides."),
      el(Text, { style: styles.backUrl }, "thenextstamptravelco.com"),
    ),
  ),
);

const outputPath = join(homedir(), "Desktop", "Dubai-vs-Luxor-Sample.pdf");
const blob = await pdf(doc).toBlob();
const arrayBuffer = await blob.arrayBuffer();
writeFileSync(outputPath, Buffer.from(arrayBuffer));
console.log(`✓ PDF saved to: ${outputPath}`);
