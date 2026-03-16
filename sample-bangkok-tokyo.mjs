import { pdf, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { createElement as el } from "react";
import { readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const city1 = JSON.parse(readFileSync("./src/data/cities/bangkok.json", "utf8"));
const city2 = JSON.parse(readFileSync("./src/data/cities/tokyo.json", "utf8"));

const tripContext = { month: 1, tripLengthDays: 10, dailyBudget: 100, travelType: "couple" };
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

function getBudgetFit(city, budget) {
  const { budget: b, mid, premium } = city.budgetTiers;
  if (budget <= b) return 10;
  if (budget <= mid) return 10 - ((budget - b) / (mid - b)) * 2;
  if (budget <= premium) return 8;
  return 10;
}

const categoryScores = CATEGORIES.map((cat) => {
  const s1 = city1[cat.key], s2 = city2[cat.key], w = cat.defaultWeight;
  const w1 = (s1 * w) / 100, w2 = (s2 * w) / 100;
  return { ...cat, score1: s1, score2: s2, weight: w, weighted1: w1, weighted2: w2,
    winner: w1 > w2 ? "city1" : w2 > w1 ? "city2" : "tie" };
});

const m1 = city1.monthlyData[tripContext.month];
const m2 = city2.monthlyData[tripContext.month];
const budgetFit1 = getBudgetFit(city1, tripContext.dailyBudget);
const budgetFit2 = getBudgetFit(city2, tripContext.dailyBudget);
const travelFit1 = city1.coupleFriendliness;
const travelFit2 = city2.coupleFriendliness;
const ws1 = categoryScores.reduce((s, c) => s + c.weighted1, 0);
const ws2 = categoryScores.reduce((s, c) => s + c.weighted2, 0);
const maxWS = categoryScores.reduce((s, c) => s + c.weight / 10, 0);
const norm = (v) => maxWS > 0 ? (v / maxWS) * 10 : 0;
const raw1 = norm(ws1)*8 + m1.weatherScore*0.5 + budgetFit1*0.3 + travelFit1*0.3;
const raw2 = norm(ws2)*8 + m2.weatherScore*0.5 + budgetFit2*0.3 + travelFit2*0.3;
const total1 = Math.round((raw1/91)*1000)/10;
const total2 = Math.round((raw2/91)*1000)/10;
const margin = Math.abs(total1 - total2);
const winner = total1 > total2 ? "city1" : "city2";
const winnerCity = winner === "city1" ? city1 : city2;
const loserCity = winner === "city1" ? city2 : city1;
const monthName = MONTHS[tripContext.month];
const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
const verdictText = `${winnerCity.city} is the stronger fit for your couple trip in ${monthName}. It edges ahead of ${loserCity.city} across the categories that matter most for this style of travel. ${loserCity.city} remains a world-class destination — particularly for food and culture — but based on your priorities and budget, ${winnerCity.city} takes the top spot.`;

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
  labelValue: { flexDirection: "row", marginBottom: 4 },
  labelText: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#BFA38A", width: 90 },
  valueText: { fontSize: 8, color: "#5C4A38", flex: 1, lineHeight: 1.5 },
  scoreRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 10, marginBottom: 8 },
  scoreBox: { alignItems: "center", flex: 1 },
  scoreBig: { fontSize: 36, fontFamily: "Helvetica-Bold", lineHeight: 1 },
  tripBar: { backgroundColor: "#F3E8DA", borderRadius: 5, padding: "8 12", marginBottom: 14, flexDirection: "row", justifyContent: "space-between" },
  tripItem: { alignItems: "center" },
  tripLabel: { fontSize: 7, color: "#BFA38A", fontFamily: "Helvetica-Bold" },
  tripValue: { fontSize: 10, color: "#5C4A38", fontFamily: "Helvetica-Bold", marginTop: 2 },
  backPage: { backgroundColor: "#7B5E43", flex: 1, padding: 60, alignItems: "center", justifyContent: "center" },
  backTitle: { color: "#FAF7F2", fontSize: 24, fontFamily: "Helvetica-Bold", textAlign: "center", marginBottom: 16 },
  backSub: { color: "#D8C2A7", fontSize: 12, textAlign: "center", marginBottom: 20, lineHeight: 1.6 },
  backUrl: { color: "#F3E8DA", fontSize: 13, fontFamily: "Helvetica-Bold", textAlign: "center" },
});

function CitySection(city, p) {
  return el(View, null,
    el(View, { style: styles.cityHeader },
      el(Text, { style: styles.cityName }, city.city),
      el(Text, { style: styles.cityCountry }, `${city.country} · ${city.language} · ${city.currency}`)
    ),
    el(Text, { style: styles.sectionTitle }, "Best Neighbourhoods to Stay"),
    ...p.neighborhoodRecs.map((n, i) => el(Text, { key: `nr${i}`, style: styles.bullet }, `• ${n}`)),
    el(Text, { style: styles.sectionTitle }, "Visa Information"),
    ...p.visaInfo.map((v, i) => el(Text, { key: `vi${i}`, style: styles.bullet }, `• ${v}`)),
    el(Text, { style: styles.sectionTitle }, "Airport Transfer"),
    el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Cheapest"), el(Text, { style: styles.valueText }, p.airportTransfer.cheapest)),
    el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Fastest"), el(Text, { style: styles.valueText }, p.airportTransfer.fastest)),
    el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Recommended"), el(Text, { style: styles.valueText }, p.airportTransfer.recommended)),
    el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Taxi estimate"), el(Text, { style: styles.valueText }, p.airportTransfer.taxiEstimate)),
    el(Text, { style: styles.sectionTitle }, "Currency & Money Tips"),
    ...p.currencyTips.map((c, i) => el(Text, { key: `ct${i}`, style: styles.bullet }, `• ${c}`)),
    el(Text, { style: styles.sectionTitle }, "SIM Card & Connectivity"),
    el(Text, { style: styles.bullet }, p.simCard),
    el(Text, { style: styles.sectionTitle }, "Daily Cost Breakdown"),
    el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Accommodation"), el(Text, { style: styles.valueText }, p.dailyCostBreakdown.accommodation)),
    el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Meals"), el(Text, { style: styles.valueText }, p.dailyCostBreakdown.meals)),
    el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Transport"), el(Text, { style: styles.valueText }, p.dailyCostBreakdown.transport)),
    el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Activities"), el(Text, { style: styles.valueText }, p.dailyCostBreakdown.activities)),
    el(Text, { style: styles.sectionTitle }, "Tipping & Etiquette"),
    ...p.tippingEtiquette.map((t, i) => el(Text, { key: `te${i}`, style: styles.bullet }, `• ${t}`)),
    el(Text, { style: styles.sectionTitle }, "Insider Tips"),
    ...p.localTips.map((t, i) => el(Text, { key: `lt${i}`, style: styles.bullet }, `• ${t}`)),
    el(Text, { style: styles.sectionTitle }, "Areas to Avoid"),
    ...p.areasToAvoid.map((a, i) => el(Text, { key: `av${i}`, style: styles.bullet }, `• ${a}`)),
    el(Text, { style: styles.sectionTitle }, "Scam Warnings"),
    ...p.scamWarnings.map((s, i) => el(Text, { key: `sw${i}`, style: styles.bullet }, `• ${s}`)),
    el(Text, { style: styles.sectionTitle }, "Day Trips"),
    ...p.dayTrips.map((d, i) => el(Text, { key: `dt${i}`, style: styles.bullet }, `• ${d}`)),
    el(Text, { style: styles.sectionTitle }, "Best Time to Visit"),
    el(Text, { style: styles.bullet }, p.bestTimeToVisit),
    el(Text, { style: styles.sectionTitle }, "Packing Tips"),
    ...p.packingTips.map((pt, i) => el(Text, { key: `pk${i}`, style: styles.bullet }, `• ${pt}`)),
    el(Text, { style: styles.sectionTitle }, "Booking Strategy"),
    el(Text, { style: styles.bullet }, p.bookingStrategy),
    el(Text, { style: styles.sectionTitle }, "Emergency Numbers"),
    el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Police"), el(Text, { style: styles.valueText }, p.emergencyNumbers.police)),
    el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Ambulance"), el(Text, { style: styles.valueText }, p.emergencyNumbers.ambulance)),
    el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "General"), el(Text, { style: styles.valueText }, p.emergencyNumbers.emergency)),
  );
}

const doc = el(Document, { title: "Bangkok vs Tokyo — Trip Comparison Report", author: "The Next Stamp Travel Co." },
  el(Page, { size: "A4", style: styles.page },
    el(View, { style: styles.header },
      el(Text, { style: styles.headerTitle }, "Bangkok vs Tokyo"),
      el(Text, { style: styles.headerSub }, "Trip Comparison Report · The Next Stamp Travel Co.")
    ),
    el(View, { style: styles.tripBar },
      el(View, { style: styles.tripItem }, el(Text, { style: styles.tripLabel }, "Travel Month"), el(Text, { style: styles.tripValue }, monthName)),
      el(View, { style: styles.tripItem }, el(Text, { style: styles.tripLabel }, "Trip Length"), el(Text, { style: styles.tripValue }, `${tripContext.tripLengthDays} days`)),
      el(View, { style: styles.tripItem }, el(Text, { style: styles.tripLabel }, "Daily Budget"), el(Text, { style: styles.tripValue }, `$${tripContext.dailyBudget}/day`)),
      el(View, { style: styles.tripItem }, el(Text, { style: styles.tripLabel }, "Travel Type"), el(Text, { style: styles.tripValue }, "Couple")),
    ),
    el(View, { style: styles.scoreRow },
      el(View, { style: styles.scoreBox },
        el(Text, { style: { fontSize: 10, color: "#5C4A38", marginBottom: 4 } }, city1.city),
        el(Text, { style: { ...styles.scoreBig, color: winner === "city1" ? "#A1785A" : "#BFA38A" } }, total1.toFixed(1)),
        winner === "city1" ? el(Text, { style: { fontSize: 9, color: "#A1785A", fontFamily: "Helvetica-Bold", marginTop: 4 } }, "✓ WINNER") : el(Text, { style: { fontSize: 9, color: "#BFA38A", marginTop: 4 } }, " ")
      ),
      el(View, { style: { alignItems: "center", justifyContent: "center", paddingTop: 8 } },
        el(Text, { style: { fontSize: 14, color: "#D8C2A7", fontFamily: "Helvetica-Bold" } }, "VS")
      ),
      el(View, { style: styles.scoreBox },
        el(Text, { style: { fontSize: 10, color: "#5C4A38", marginBottom: 4 } }, city2.city),
        el(Text, { style: { ...styles.scoreBig, color: winner === "city2" ? "#A1785A" : "#BFA38A" } }, total2.toFixed(1)),
        winner === "city2" ? el(Text, { style: { fontSize: 9, color: "#A1785A", fontFamily: "Helvetica-Bold", marginTop: 4 } }, "✓ WINNER") : el(Text, { style: { fontSize: 9, color: "#BFA38A", marginTop: 4 } }, " ")
      ),
    ),
    el(Text, { style: styles.sectionTitle }, `Seasonal Snapshot — ${monthName}`),
    el(View, { style: styles.tableHeader },
      el(Text, { style: styles.tableHeaderText }, "Category"),
      el(Text, { style: styles.tableHeaderText }, city1.city),
      el(Text, { style: styles.tableHeaderText }, city2.city),
    ),
    ...[
      ["Weather Score", `${m1.weatherScore}/10`, `${m2.weatherScore}/10`, m1.weatherScore >= m2.weatherScore],
      ["Avg Temperature", `${m1.avgTempCelsius}°C`, `${m2.avgTempCelsius}°C`, false],
      ["Rainy Days", `${m1.rainyDays} days`, `${m2.rainyDays} days`, m1.rainyDays <= m2.rainyDays],
      ["Crowd Level", `${m1.crowdLevel}/10`, `${m2.crowdLevel}/10`, m1.crowdLevel <= m2.crowdLevel],
      ["Flight Price Index", `${m1.flightPriceIndex}/10`, `${m2.flightPriceIndex}/10`, m1.flightPriceIndex <= m2.flightPriceIndex],
    ].map(([label, v1, v2, c1wins], i) =>
      el(View, { key: `sr${i}`, style: { ...styles.tableRow, backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#FAF7F2" } },
        el(Text, { style: styles.tableCell }, label),
        el(Text, { style: c1wins ? styles.tableCellBold : styles.tableCell }, v1),
        el(Text, { style: !c1wins ? styles.tableCellBold : styles.tableCell }, v2),
      )
    ),
    el(Text, { style: styles.sectionTitle }, "Score Comparison by Category"),
    el(View, { style: styles.tableHeader },
      el(Text, { style: styles.tableHeaderText }, "Category"),
      el(Text, { style: styles.tableHeaderText }, city1.city),
      el(Text, { style: styles.tableHeaderText }, city2.city),
    ),
    ...categoryScores.map((cat, i) =>
      el(View, { key: `cs${i}`, style: { ...styles.tableRow, backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#FAF7F2" } },
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
      el(Text, { style: styles.footerText }, `Generated ${today} · Couple trip · ${monthName} · ${tripContext.tripLengthDays} days · $${tripContext.dailyBudget}/day`),
      el(Text, { style: styles.footerText }, "thenextstamptravelco.com"),
    ),
  ),
  el(Page, { size: "A4", style: styles.page },
    el(Text, { style: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#7B5E43", marginBottom: 14 } }, `Full Insider Breakdown: ${city1.city}`),
    CitySection(city1, city1.premium),
    el(View, { style: styles.footer },
      el(Text, { style: styles.footerText }, "The Next Stamp Travel Co."),
      el(Text, { style: styles.footerText }, "thenextstamptravelco.com"),
    ),
  ),
  el(Page, { size: "A4", style: styles.page },
    el(Text, { style: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#7B5E43", marginBottom: 14 } }, `Full Insider Breakdown: ${city2.city}`),
    CitySection(city2, city2.premium),
    el(View, { style: styles.footer },
      el(Text, { style: styles.footerText }, "The Next Stamp Travel Co."),
      el(Text, { style: styles.footerText }, "thenextstamptravelco.com"),
    ),
  ),
  el(Page, { size: "A4", style: { ...styles.page, padding: 0 } },
    el(View, { style: styles.backPage },
      el(Text, { style: styles.backTitle }, "Ready to book your trip?"),
      el(Text, { style: styles.backSub }, "Visit The Next Stamp Travel Co. for curated day-by-day\nitineraries, custom trip planning, and expert travel guides."),
      el(Text, { style: styles.backUrl }, "thenextstamptravelco.com"),
    ),
  ),
);

const outputPath = join(homedir(), "Documents", "Bangkok-vs-Tokyo-Sample.pdf");
const blob = await pdf(doc).toBlob();
writeFileSync(outputPath, Buffer.from(await blob.arrayBuffer()));
console.log(`✓ PDF saved to: ${outputPath}`);
