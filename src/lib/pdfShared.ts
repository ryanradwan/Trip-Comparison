import { ComparisonResult, PremiumContent, TripContext } from "./types";
import { MONTHS } from "./constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRenderer = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyReact = any;

function sanitize(text: string): string {
  if (text == null) return "";
  const str = typeof text === "string" ? text : String(text);
  return str
    .replace(/₩/g, "KRW ").replace(/₺/g, "TRY ").replace(/₱/g, "PHP ")
    .replace(/₹/g, "INR ").replace(/₫/g, "VND ").replace(/£/g, "GBP ")
    .replace(/€/g, "EUR ")
    .replace(/İ/g, "I").replace(/ı/g, "i").replace(/ğ/g, "g").replace(/Ğ/g, "G")
    .replace(/ş/g, "s").replace(/Ş/g, "S").replace(/ç/g, "c").replace(/Ç/g, "C")
    .replace(/ö/g, "o").replace(/Ö/g, "O").replace(/ü/g, "u").replace(/Ü/g, "U")
    .replace(/ñ/g, "n").replace(/Ñ/g, "N")
    .replace(/á/g, "a").replace(/à/g, "a").replace(/â/g, "a").replace(/ä/g, "a").replace(/ã/g, "a")
    .replace(/Á/g, "A").replace(/À/g, "A").replace(/Â/g, "A").replace(/Ä/g, "A")
    .replace(/é/g, "e").replace(/è/g, "e").replace(/ê/g, "e").replace(/ë/g, "e")
    .replace(/É/g, "E").replace(/È/g, "E").replace(/Ê/g, "E")
    .replace(/í/g, "i").replace(/ì/g, "i").replace(/î/g, "i").replace(/ï/g, "i")
    .replace(/ó/g, "o").replace(/ò/g, "o").replace(/ô/g, "o").replace(/õ/g, "o")
    .replace(/Ó/g, "O").replace(/Ô/g, "O")
    .replace(/ú/g, "u").replace(/ù/g, "u").replace(/û/g, "u")
    .replace(/Ú/g, "U")
    .replace(/\u2018|\u2019/g, "'").replace(/\u201C|\u201D/g, '"')
    .replace(/\u2013|\u2014/g, "-").replace(/\u2026/g, "...")
    .replace(/[^\x00-\x7F]/g, "");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createStyles(StyleSheet: any) {
  return StyleSheet.create({
    // ── Base layout ──────────────────────────────────────────────────
    page: { backgroundColor: "#FAF7F2", padding: 0, fontFamily: "Helvetica", flexDirection: "column" as const },
    pageContent: { padding: "28 40 16 40" },
    footer: { flexDirection: "row" as const, justifyContent: "space-between" as const, borderTopWidth: 1, borderTopColor: "#D8C2A7", paddingTop: 6, paddingBottom: 12, paddingHorizontal: 40 },
    footerText: { fontSize: 7.5, color: "#BFA38A" },

    // ── Cover page ────────────────────────────────────────────────────
    coverHeader: { backgroundColor: "#7B5E43", padding: "36 40 30 40" },
    coverBrand: { color: "#D8C2A7", fontSize: 8.5, fontFamily: "Helvetica-Bold", letterSpacing: 2, marginBottom: 18, textTransform: "uppercase" as const },
    coverCity1: { color: "#FFFFFF", fontSize: 32, fontFamily: "Helvetica-Bold", marginBottom: 2 },
    coverVs: { color: "#BFA38A", fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 2, letterSpacing: 3 },
    coverCity2: { color: "#F3E8DA", fontSize: 32, fontFamily: "Helvetica-Bold" },
    coverMeta: { color: "#D8C2A7", fontSize: 10, marginTop: 12 },

    // Winner / tie box
    winnerBox: { backgroundColor: "#4E8C5F", borderRadius: 6, padding: "14 20", margin: "20 40 0 40" },
    winnerLabel: { color: "#A8D5B5", fontSize: 8.5, fontFamily: "Helvetica-Bold", letterSpacing: 2, marginBottom: 3 },
    winnerCity: { color: "#FFFFFF", fontSize: 22, fontFamily: "Helvetica-Bold", marginBottom: 2 },
    winnerSub: { color: "#D4EDDA", fontSize: 9.5 },
    tieBox: { backgroundColor: "#A1785A", borderRadius: 6, padding: "14 20", margin: "20 40 0 40" },
    tieLabel: { color: "#F3E8DA", fontSize: 8.5, fontFamily: "Helvetica-Bold", letterSpacing: 2, marginBottom: 3 },
    tieTitle: { color: "#FFFFFF", fontSize: 22, fontFamily: "Helvetica-Bold", marginBottom: 2 },
    tieSub: { color: "#F3E8DA", fontSize: 9.5 },

    // Cover estimate stats
    coverEstimateBox: { margin: "14 40 0 40", flexDirection: "row" as const, gap: 8 },
    coverEstimateStat: { flex: 1, backgroundColor: "#6B4E35", borderRadius: 4, padding: "10 12" },
    coverEstimateValue: { color: "#FFFFFF", fontSize: 15, fontFamily: "Helvetica-Bold" },
    coverEstimateLabel: { color: "#D8C2A7", fontSize: 7.5, letterSpacing: 1, textTransform: "uppercase" as const, marginTop: 2 },

    // Cover "What's Inside" box
    coverInsideBox: { margin: "14 40 0 40", backgroundColor: "#F3E8DA", borderRadius: 4, padding: "12 16" },
    coverInsideTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#BFA38A", letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 8 },
    coverInsideGrid: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 2 },
    coverInsideItem: { width: "48%", fontSize: 9.5, color: "#5C4A38", marginBottom: 4, paddingLeft: 2 },

    // ── Section titles / body ─────────────────────────────────────────
    pageTitle: { fontSize: 15, fontFamily: "Helvetica-Bold", color: "#7B5E43", marginBottom: 14 },
    sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#7B5E43", marginBottom: 5, marginTop: 12, borderBottomWidth: 1, borderBottomColor: "#D8C2A7", paddingBottom: 3 },
    sectionTitleSm: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#7B5E43", marginBottom: 4, marginTop: 10 },
    bodyText: { fontSize: 9.5, color: "#5C4A38", lineHeight: 1.5 },
    bullet: { fontSize: 9, color: "#5C4A38", marginBottom: 3, paddingLeft: 6 },

    // ── Tables ────────────────────────────────────────────────────────
    tableHeader: { flexDirection: "row" as const, backgroundColor: "#7B5E43", padding: "6 8", marginBottom: 1 },
    tableHeaderText: { color: "#FFFFFF", fontSize: 8.5, fontFamily: "Helvetica-Bold", flex: 1 },
    tableRow: { flexDirection: "row" as const, padding: "4 8", borderBottomWidth: 1, borderBottomColor: "#F3E8DA" },
    tableCell: { flex: 1, fontSize: 9, color: "#5C4A38" },
    tableCellWinner: { flex: 1, fontSize: 9, color: "#4E8C5F", fontFamily: "Helvetica-Bold" },

    // ── Score bars ────────────────────────────────────────────────────
    barRow: { flexDirection: "row" as const, alignItems: "center" as const, padding: "4 8", borderBottomWidth: 1, borderBottomColor: "#F3E8DA" },
    barLabel: { fontSize: 9, color: "#5C4A38", width: 110 },
    barTrack: { flex: 1, backgroundColor: "#F3E8DA", borderRadius: 3, height: 7, marginHorizontal: 4 },
    barFillGreen: { backgroundColor: "#4E8C5F", height: 7, borderRadius: 3 },
    barFillMuted: { backgroundColor: "#BFA38A", height: 7, borderRadius: 3 },
    barFillBronze: { backgroundColor: "#A1785A", height: 7, borderRadius: 3 },
    barScore: { fontSize: 7.5, color: "#BFA38A", width: 20, textAlign: "right" as const },

    // ── "Where X Dominates" callout boxes ────────────────────────────
    dominatesRow: { flexDirection: "row" as const, gap: 10, marginTop: 12, marginBottom: 4 },
    dominatesBox: { flex: 1, backgroundColor: "#F3E8DA", borderRadius: 5, padding: "10 12" },
    dominatesTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#BFA38A", letterSpacing: 1.5, textTransform: "uppercase" as const, marginBottom: 6 },
    dominatesWinnerCity: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#4E8C5F", marginBottom: 5 },
    dominatesItem: { fontSize: 8.5, color: "#5C4A38", marginBottom: 3 },

    // ── Verdict ───────────────────────────────────────────────────────
    verdictBox: { backgroundColor: "#F3E8DA", borderWidth: 1, borderColor: "#D8C2A7", padding: "12 14", borderRadius: 6, marginTop: 12 },
    verdictTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#A1785A", marginBottom: 4 },
    verdictText: { fontSize: 9, color: "#5C4A38", lineHeight: 1.6 },

    // ── Intelligence Dashboard ────────────────────────────────────────
    fitRow: { flexDirection: "row" as const, gap: 10, marginTop: 6 },
    fitBox: { flex: 1, backgroundColor: "#F3E8DA", borderRadius: 6, padding: "10 12" },
    fitPercent: { fontSize: 26, fontFamily: "Helvetica-Bold", color: "#7B5E43", marginBottom: 1 },
    fitLabel: { fontSize: 7.5, color: "#BFA38A", fontFamily: "Helvetica-Bold", textTransform: "uppercase" as const, letterSpacing: 1 },
    fitSub: { fontSize: 8.5, color: "#5C4A38", marginTop: 3 },
    fitWinnerPercent: { fontSize: 26, fontFamily: "Helvetica-Bold", color: "#4E8C5F", marginBottom: 1 },

    intelligenceGrid: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 4, marginTop: 6 },
    intelligenceCell: { width: "31.5%", backgroundColor: "#F3E8DA", padding: "5 7", borderRadius: 3, marginBottom: 2 },
    intelligenceCellLabel: { fontSize: 7, color: "#BFA38A", fontFamily: "Helvetica-Bold", textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 2 },
    intelligenceCellScores: { flexDirection: "row" as const, alignItems: "baseline" as const, gap: 2 },
    intelligenceScore: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#7B5E43" },
    intelligenceScoreWinner: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#4E8C5F" },
    intelligenceScoreSep: { fontSize: 8, color: "#BFA38A" },

    // Full seasonal table
    seasonalTableHeader: { flexDirection: "row" as const, backgroundColor: "#7B5E43", padding: "5 6", marginBottom: 1 },
    seasonalHeaderMonth: { width: 26, fontSize: 7.5, color: "#FFFFFF", fontFamily: "Helvetica-Bold" },
    seasonalHeaderCell: { flex: 1, fontSize: 7.5, color: "#FFFFFF", fontFamily: "Helvetica-Bold", textAlign: "center" as const },
    seasonalHeaderSep: { width: 8, fontSize: 7.5, color: "#D8C2A7", textAlign: "center" as const },
    seasonalRow: { flexDirection: "row" as const, padding: "2.5 6", borderBottomWidth: 1, borderBottomColor: "#F3E8DA" },
    seasonalMonthLabel: { width: 26, fontSize: 7.5, color: "#5C4A38", fontFamily: "Helvetica-Bold" },
    seasonalCell: { flex: 1, fontSize: 7.5, color: "#BFA38A", textAlign: "center" as const },
    seasonalCellBest: { flex: 1, fontSize: 7.5, color: "#4E8C5F", fontFamily: "Helvetica-Bold", textAlign: "center" as const },
    seasonalCellAvoid: { flex: 1, fontSize: 7.5, color: "#B85640", textAlign: "center" as const },
    seasonalSep: { width: 8, fontSize: 7.5, color: "#D8C2A7", textAlign: "center" as const },
    seasonalRowHighlight: { flexDirection: "row" as const, padding: "2.5 6", borderBottomWidth: 1, borderBottomColor: "#D8C2A7", backgroundColor: "#EDE7DE" },

    // ── City breakdown pages ──────────────────────────────────────────
    cityPageHeader: { backgroundColor: "#7B5E43", padding: "18 40 16 40" },
    cityPageTitle: { color: "#FFFFFF", fontSize: 17, fontFamily: "Helvetica-Bold", marginBottom: 2 },
    cityPageSub: { color: "#D8C2A7", fontSize: 9.5 },

    atAGlanceRow: { flexDirection: "row" as const, gap: 6, paddingTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: "#D8C2A7" },
    atAGlanceCell: { flex: 1 },
    atAGlanceLabel: { fontSize: 7, fontFamily: "Helvetica-Bold", color: "#BFA38A", textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 2 },
    atAGlanceValue: { fontSize: 9.5, color: "#5C4A38", fontFamily: "Helvetica-Bold" },

    descriptionBlock: { backgroundColor: "#F3E8DA", borderRadius: 4, padding: "8 10", marginBottom: 2, marginTop: 8 },
    descriptionText: { fontSize: 9, color: "#5C4A38", lineHeight: 1.6, fontStyle: "italic" as const },

    budgetRow: { flexDirection: "row" as const, marginTop: 4 },
    budgetCell: { flex: 1, padding: "7 9", borderWidth: 1, borderColor: "#D8C2A7", marginRight: 4, borderRadius: 3 },
    budgetTierLabel: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: "#BFA38A", textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 2 },
    budgetTierValue: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#7B5E43" },
    budgetTierSub: { fontSize: 7.5, color: "#BFA38A", marginTop: 1 },

    twoCol: { flexDirection: "row" as const, gap: 14, marginTop: 2 },
    twoColLeft: { flex: 1 },
    twoColRight: { flex: 1 },

    labelValue: { flexDirection: "row" as const, marginBottom: 3 },
    labelText: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#BFA38A", width: 80 },
    valueText: { fontSize: 8.5, color: "#5C4A38", flex: 1, lineHeight: 1.4 },

    // ── Back cover ────────────────────────────────────────────────────
    backPage: { backgroundColor: "#7B5E43", flex: 1, padding: "48 52", alignItems: "center" as const, justifyContent: "center" as const },
    backBrand: { color: "#D8C2A7", fontSize: 8, fontFamily: "Helvetica-Bold", letterSpacing: 3, textTransform: "uppercase" as const, marginBottom: 20, textAlign: "center" as const },
    backTitle: { color: "#FAF7F2", fontSize: 20, fontFamily: "Helvetica-Bold", textAlign: "center" as const, marginBottom: 6 },
    backSub: { color: "#D8C2A7", fontSize: 10, textAlign: "center" as const, marginBottom: 20, lineHeight: 1.6 },

    backSummaryBox: { borderWidth: 1, borderColor: "#9B7E65", borderRadius: 6, padding: "12 16", marginBottom: 16, width: "100%" },
    backSummaryTitle: { color: "#D8C2A7", fontSize: 7.5, fontFamily: "Helvetica-Bold", letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 10 },
    backSummaryRow: { flexDirection: "row" as const, justifyContent: "space-between" as const, marginBottom: 6 },
    backSummaryLabel: { color: "#BFA38A", fontSize: 8.5 },
    backSummaryValue: { color: "#FFFFFF", fontSize: 9, fontFamily: "Helvetica-Bold" },

    backReasonsTitle: { color: "#D8C2A7", fontSize: 7.5, fontFamily: "Helvetica-Bold", letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 8, width: "100%", textAlign: "center" as const },
    backReasonItem: { flexDirection: "row" as const, gap: 8, marginBottom: 6, width: "100%" },
    backReasonNum: { color: "#A8D5B5", fontSize: 11, fontFamily: "Helvetica-Bold", width: 16, textAlign: "center" as const },
    backReasonText: { color: "#F3E8DA", fontSize: 9.5, flex: 1, lineHeight: 1.5 },

    backCtaBox: { backgroundColor: "#4E8C5F", borderRadius: 6, padding: "10 16", marginTop: 14, width: "100%" },
    backCtaLabel: { color: "#A8D5B5", fontSize: 7.5, fontFamily: "Helvetica-Bold", letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 3, textAlign: "center" as const },
    backCtaUrl: { color: "#FFFFFF", fontSize: 12, fontFamily: "Helvetica-Bold", textAlign: "center" as const },

    backUrl: { color: "#BFA38A", fontSize: 9, textAlign: "center" as const, marginTop: 18 },
  });
}

export function buildPdfDocument(
  renderer: AnyRenderer,
  React: AnyReact,
  result: ComparisonResult,
  city1Premium: PremiumContent,
  city2Premium: PremiumContent,
  tripContext: TripContext
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  const { Document, Page, Text, View, StyleSheet } = renderer;
  const styles = createStyles(StyleSheet);

  const monthName = MONTHS[tripContext.month];
  const m1 = result.city1.monthlyData[tripContext.month];
  const m2 = result.city2.monthlyData[tripContext.month];
  const winnerCity = result.winner === "city2" ? result.city2 : result.city1;
  const winnerScore = result.winner === "city2" ? result.totalScore2 : result.totalScore1;
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const travelLabel = tripContext.travelType.charAt(0).toUpperCase() + tripContext.travelType.slice(1);
  const isWinner1 = result.winner === "city1";
  const isTie = result.winner === "tie";
  const estimatedTripCost = tripContext.tripLengthDays * tripContext.dailyBudget;

  // Top 3 category wins per city for dominates boxes and back cover
  const city1Wins = result.categoryScores
    .filter(c => c.winner === "city1")
    .sort((a, b) => (b.score1 - b.score2) - (a.score1 - a.score2))
    .slice(0, 3);
  const city2Wins = result.categoryScores
    .filter(c => c.winner === "city2")
    .sort((a, b) => (b.score2 - b.score1) - (a.score2 - a.score1))
    .slice(0, 3);
  const winnerTopWins = isWinner1 ? city1Wins : city2Wins;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function el(type: any, props: any, ...children: any[]): any {
    return React.createElement(type, props, ...children);
  }

  function Footer(left: string, right: string) {
    return el(View, { style: styles.footer },
      el(Text, { style: styles.footerText }, left),
      el(Text, { style: styles.footerText }, right)
    );
  }

  function ScoreBar(label: string, score1: number, score2: number, winner: string) {
    const bar1Color = winner === "city1" ? styles.barFillGreen : winner === "city2" ? styles.barFillMuted : styles.barFillBronze;
    const bar2Color = winner === "city2" ? styles.barFillGreen : winner === "city1" ? styles.barFillMuted : styles.barFillBronze;
    return el(View, { style: styles.barRow },
      el(Text, { style: styles.barLabel }, label),
      el(Text, { style: styles.barScore }, `${score1}`),
      el(View, { style: styles.barTrack },
        el(View, { style: { ...bar1Color, width: `${Math.min(score1, 10) * 10}%` } })
      ),
      el(View, { style: styles.barTrack },
        el(View, { style: { ...bar2Color, width: `${Math.min(score2, 10) * 10}%` } })
      ),
      el(Text, { style: styles.barScore }, `${score2}`)
    );
  }

  function IntelligenceCell(label: string, score1: number, score2: number, invertWinner = false) {
    const city1Wins = invertWinner ? score1 <= score2 : score1 >= score2;
    return el(View, { style: styles.intelligenceCell },
      el(Text, { style: styles.intelligenceCellLabel }, label),
      el(View, { style: styles.intelligenceCellScores },
        el(Text, { style: city1Wins ? styles.intelligenceScoreWinner : styles.intelligenceScore }, `${score1}`),
        el(Text, { style: styles.intelligenceScoreSep }, " / "),
        el(Text, { style: !city1Wins ? styles.intelligenceScoreWinner : styles.intelligenceScore }, `${score2}`)
      )
    );
  }

  function CityBreakdownPage(
    city: typeof result.city1,
    premium: PremiumContent,
    overallScore: number
  ) {
    const bt = city.budgetTiers;
    return el(Page, { size: "A4", style: styles.page },
      el(View, { style: styles.cityPageHeader },
        el(Text, { style: styles.cityPageTitle }, sanitize(city.city)),
        el(Text, { style: styles.cityPageSub }, `${sanitize(city.country)}  |  ${sanitize(city.region)}  |  Overall Score: ${Math.round(overallScore)}%`)
      ),
      el(View, { style: styles.pageContent },

        // At a glance
        el(View, { style: styles.atAGlanceRow },
          el(View, { style: styles.atAGlanceCell },
            el(Text, { style: styles.atAGlanceLabel }, "Language"),
            el(Text, { style: { ...styles.atAGlanceValue } }, sanitize(city.language))
          ),
          el(View, { style: styles.atAGlanceCell },
            el(Text, { style: styles.atAGlanceLabel }, "Currency"),
            el(Text, { style: { ...styles.atAGlanceValue } }, sanitize(city.currency))
          ),
          el(View, { style: styles.atAGlanceCell },
            el(Text, { style: styles.atAGlanceLabel }, "Airport"),
            el(Text, { style: { ...styles.atAGlanceValue } }, city.airportCode)
          ),
          el(View, { style: styles.atAGlanceCell },
            el(Text, { style: styles.atAGlanceLabel }, "Region"),
            el(Text, { style: { ...styles.atAGlanceValue } }, sanitize(city.region))
          ),
          el(View, { style: styles.atAGlanceCell },
            el(Text, { style: styles.atAGlanceLabel }, "Budget / Day"),
            el(Text, { style: { ...styles.atAGlanceValue } }, `$${bt.budget} - $${bt.premium}`)
          )
        ),

        // Description
        el(View, { style: styles.descriptionBlock },
          el(Text, { style: styles.descriptionText }, sanitize(city.description))
        ),

        // Budget tiers
        el(Text, { style: styles.sectionTitle }, "Budget at a Glance"),
        el(View, { style: styles.budgetRow },
          el(View, { style: styles.budgetCell },
            el(Text, { style: styles.budgetTierLabel }, "Budget"),
            el(Text, { style: styles.budgetTierValue }, `$${bt.budget}`),
            el(Text, { style: styles.budgetTierSub }, "per day")
          ),
          el(View, { style: styles.budgetCell },
            el(Text, { style: styles.budgetTierLabel }, "Mid-Range"),
            el(Text, { style: styles.budgetTierValue }, `$${bt.mid}`),
            el(Text, { style: styles.budgetTierSub }, "per day")
          ),
          el(View, { style: { ...styles.budgetCell, marginRight: 0 } },
            el(Text, { style: styles.budgetTierLabel }, "Premium"),
            el(Text, { style: styles.budgetTierValue }, `$${bt.premium}`),
            el(Text, { style: styles.budgetTierSub }, "per day")
          )
        ),

        // Two-column logistics
        el(View, { style: styles.twoCol },
          // Left column
          el(View, { style: styles.twoColLeft },
            el(Text, { style: styles.sectionTitleSm }, "Neighbourhoods to Stay"),
            ...premium.neighborhoodRecs.map((n, i) => el(Text, { key: `nbhd-${i}`, style: styles.bullet }, `- ${sanitize(n)}`)),
            el(Text, { style: styles.sectionTitleSm }, "Areas to Avoid"),
            ...premium.areasToAvoid.map((a, i) => el(Text, { key: `avoid-${i}`, style: styles.bullet }, `- ${sanitize(a)}`)),
            el(Text, { style: styles.sectionTitleSm }, "Scam Warnings"),
            ...premium.scamWarnings.map((s, i) => el(Text, { key: `scam-${i}`, style: styles.bullet }, `- ${sanitize(s)}`)),
            el(Text, { style: styles.sectionTitleSm }, "Visa Information"),
            ...premium.visaInfo.map((v, i) => el(Text, { key: `visa-${i}`, style: styles.bullet }, `- ${sanitize(v)}`))
          ),
          // Right column
          el(View, { style: styles.twoColRight },
            el(Text, { style: styles.sectionTitleSm }, "Airport Transfer"),
            el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Cheapest"), el(Text, { style: styles.valueText }, sanitize(premium.airportTransfer.cheapest))),
            el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Fastest"), el(Text, { style: styles.valueText }, sanitize(premium.airportTransfer.fastest))),
            el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Recommended"), el(Text, { style: styles.valueText }, sanitize(premium.airportTransfer.recommended))),
            el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Taxi Estimate"), el(Text, { style: styles.valueText }, sanitize(premium.airportTransfer.taxiEstimate))),
            el(Text, { style: styles.sectionTitleSm }, "Currency & Money Tips"),
            ...premium.currencyTips.map((c, i) => el(Text, { key: `curr-${i}`, style: styles.bullet }, `- ${sanitize(c)}`)),
            el(Text, { style: styles.sectionTitleSm }, "SIM Card & Connectivity"),
            el(Text, { style: styles.bullet }, `- ${sanitize(premium.simCard)}`),
            el(Text, { style: styles.sectionTitleSm }, "Emergency Numbers"),
            el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Police"), el(Text, { style: styles.valueText }, sanitize(premium.emergencyNumbers.police))),
            el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Ambulance"), el(Text, { style: styles.valueText }, sanitize(premium.emergencyNumbers.ambulance))),
            el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Emergency"), el(Text, { style: styles.valueText }, sanitize(premium.emergencyNumbers.emergency)))
          )
        ),

        // Full-width sections
        el(Text, { style: styles.sectionTitle }, "Tipping & Etiquette"),
        ...premium.tippingEtiquette.map((t, i) => el(Text, { key: `tip-${i}`, style: styles.bullet }, `- ${sanitize(t)}`)),
        el(Text, { style: styles.sectionTitle }, "Daily Cost Breakdown"),
        el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Accommodation"), el(Text, { style: styles.valueText }, sanitize(premium.dailyCostBreakdown.accommodation))),
        el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Meals"), el(Text, { style: styles.valueText }, sanitize(premium.dailyCostBreakdown.meals))),
        el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Transport"), el(Text, { style: styles.valueText }, sanitize(premium.dailyCostBreakdown.transport))),
        el(View, { style: styles.labelValue }, el(Text, { style: styles.labelText }, "Activities"), el(Text, { style: styles.valueText }, sanitize(premium.dailyCostBreakdown.activities))),
        el(Text, { style: styles.sectionTitle }, "Insider Tips"),
        ...premium.localTips.map((t, i) => el(Text, { key: `ltip-${i}`, style: styles.bullet }, `- ${sanitize(t)}`)),
        el(Text, { style: styles.sectionTitle }, "Day Trips"),
        ...premium.dayTrips.map((d, i) => el(Text, { key: `day-${i}`, style: styles.bullet }, `- ${sanitize(d)}`)),
        el(Text, { style: styles.sectionTitle }, "Packing Tips"),
        ...premium.packingTips.map((t, i) => el(Text, { key: `pack-${i}`, style: styles.bullet }, `- ${sanitize(t)}`)),
        el(Text, { style: styles.sectionTitle }, "Best Time to Visit"),
        el(Text, { style: styles.bullet }, `- ${sanitize(premium.bestTimeToVisit)}`),
        el(Text, { style: styles.sectionTitle }, "Booking Strategy"),
        el(Text, { style: styles.bullet }, `- ${sanitize(premium.bookingStrategy)}`)
      ),
      Footer(`${sanitize(city.city)} Insider Guide`, "thenextstamptravelco.com")
    );
  }

  return el(Document, null,

    // ══════════════════════════════════════════════════════════════════
    // PAGE 1 — COVER
    // ══════════════════════════════════════════════════════════════════
    el(Page, { size: "A4", style: styles.page },
      // Espresso header
      el(View, { style: styles.coverHeader },
        el(Text, { style: styles.coverBrand }, "The Next Stamp Travel Co.  |  Trip Intelligence Report"),
        el(Text, { style: styles.coverCity1 }, sanitize(result.city1.city)),
        el(Text, { style: styles.coverVs }, "VS"),
        el(Text, { style: styles.coverCity2 }, sanitize(result.city2.city)),
        el(Text, { style: styles.coverMeta }, `${travelLabel} Trip  |  ${monthName}  |  ${tripContext.tripLengthDays} Days  |  $${tripContext.dailyBudget}/day budget`)
      ),

      // Winner / tie box
      isTie
        ? el(View, { style: styles.tieBox },
            el(Text, { style: styles.tieLabel }, "Result"),
            el(Text, { style: styles.tieTitle }, "It's a Tie"),
            el(Text, { style: styles.tieSub }, "Both cities score equally for your travel priorities")
          )
        : el(View, { style: styles.winnerBox },
            el(Text, { style: styles.winnerLabel }, "Top Pick for Your Trip"),
            el(Text, { style: styles.winnerCity }, sanitize(winnerCity.city)),
            el(Text, { style: styles.winnerSub }, `${Math.round(winnerScore)}% match score  |  ${result.marginOfVictory.toFixed(1)} point lead`)
          ),

      // Trip estimate stats
      el(View, { style: styles.coverEstimateBox },
        el(View, { style: styles.coverEstimateStat },
          el(Text, { style: styles.coverEstimateValue }, `$${estimatedTripCost.toLocaleString()}`),
          el(Text, { style: styles.coverEstimateLabel }, "Est. Trip Budget")
        ),
        el(View, { style: styles.coverEstimateStat },
          el(Text, { style: styles.coverEstimateValue }, `${Math.round(result.totalScore1)}% vs ${Math.round(result.totalScore2)}%`),
          el(Text, { style: styles.coverEstimateLabel }, "Match Scores")
        ),
        el(View, { style: styles.coverEstimateStat },
          el(Text, { style: styles.coverEstimateValue }, monthName),
          el(Text, { style: styles.coverEstimateLabel }, "Travel Month")
        )
      ),

      // What's inside
      el(View, { style: styles.coverInsideBox },
        el(Text, { style: styles.coverInsideTitle }, "What's Inside This Report"),
        el(View, { style: styles.coverInsideGrid },
          el(Text, { style: styles.coverInsideItem }, "01  Score Analysis & Comparison"),
          el(Text, { style: styles.coverInsideItem }, "02  Traveler Fit & Budget Match"),
          el(Text, { style: styles.coverInsideItem }, "03  19-Point City Intelligence Grid"),
          el(Text, { style: styles.coverInsideItem }, "04  Full Seasonal Calendar"),
          el(Text, { style: styles.coverInsideItem }, `05  ${sanitize(result.city1.city)} Insider Guide`),
          el(Text, { style: styles.coverInsideItem }, `06  ${sanitize(result.city2.city)} Insider Guide`),
          el(Text, { style: styles.coverInsideItem }, "07  Neighbourhoods, Safety & Scams"),
          el(Text, { style: styles.coverInsideItem }, "08  Budget, Booking & Packing Tips")
        )
      ),

      el(View, { style: { flex: 1 } }),
      Footer(`Generated ${today}`, "thenextstamptravelco.com")
    ),

    // ══════════════════════════════════════════════════════════════════
    // PAGE 2 — INTELLIGENCE DASHBOARD
    // ══════════════════════════════════════════════════════════════════
    el(Page, { size: "A4", style: styles.page },
      el(View, { style: styles.pageContent },
        el(Text, { style: styles.pageTitle }, "City Intelligence Dashboard"),

        // Traveler Fit
        el(Text, { style: styles.sectionTitle }, "Traveler Fit Analysis"),
        el(View, { style: styles.fitRow },
          el(View, { style: styles.fitBox },
            el(Text, { style: styles.fitLabel }, `${sanitize(result.city1.city)}  |  Travel Style Fit`),
            el(Text, { style: result.travelTypeFit1 >= result.travelTypeFit2 ? styles.fitWinnerPercent : styles.fitPercent }, `${Math.round(result.travelTypeFit1)}%`),
            el(Text, { style: styles.fitSub }, `For ${travelLabel.toLowerCase()} travel`)
          ),
          el(View, { style: styles.fitBox },
            el(Text, { style: styles.fitLabel }, `${sanitize(result.city2.city)}  |  Travel Style Fit`),
            el(Text, { style: result.travelTypeFit2 > result.travelTypeFit1 ? styles.fitWinnerPercent : styles.fitPercent }, `${Math.round(result.travelTypeFit2)}%`),
            el(Text, { style: styles.fitSub }, `For ${travelLabel.toLowerCase()} travel`)
          ),
          el(View, { style: styles.fitBox },
            el(Text, { style: styles.fitLabel }, `${sanitize(result.city1.city)}  |  Budget Fit`),
            el(Text, { style: result.budgetFit1 >= result.budgetFit2 ? styles.fitWinnerPercent : styles.fitPercent }, `${Math.round(result.budgetFit1)}%`),
            el(Text, { style: styles.fitSub }, `At $${tripContext.dailyBudget}/day`)
          ),
          el(View, { style: styles.fitBox },
            el(Text, { style: styles.fitLabel }, `${sanitize(result.city2.city)}  |  Budget Fit`),
            el(Text, { style: result.budgetFit2 > result.budgetFit1 ? styles.fitWinnerPercent : styles.fitPercent }, `${Math.round(result.budgetFit2)}%`),
            el(Text, { style: styles.fitSub }, `At $${tripContext.dailyBudget}/day`)
          )
        ),

        // 19-attribute grid
        el(Text, { style: styles.sectionTitle }, `19-Point Score Grid  |  ${sanitize(result.city1.city)} vs ${sanitize(result.city2.city)}`),
        el(View, { style: styles.intelligenceGrid },
          IntelligenceCell("Food Scene", result.city1.foodScene, result.city2.foodScene),
          IntelligenceCell("Walkability", result.city1.walkability, result.city2.walkability),
          IntelligenceCell("Nightlife", result.city1.nightlife, result.city2.nightlife),
          IntelligenceCell("Safety", result.city1.safety, result.city2.safety),
          IntelligenceCell("Cultural Depth", result.city1.culturalDepth, result.city2.culturalDepth),
          IntelligenceCell("Transport Ease", result.city1.transportationEase, result.city2.transportationEase),
          IntelligenceCell("English", result.city1.englishFriendliness, result.city2.englishFriendliness),
          IntelligenceCell("Affordability", result.city1.affordability, result.city2.affordability),
          IntelligenceCell("Beach Quality", result.city1.beachQuality, result.city2.beachQuality),
          IntelligenceCell("Adventure", result.city1.adventureActivities, result.city2.adventureActivities),
          IntelligenceCell("Shopping", result.city1.shoppingScene, result.city2.shoppingScene),
          IntelligenceCell("Wellness", result.city1.wellnessScene, result.city2.wellnessScene),
          IntelligenceCell("Digital Nomad", result.city1.digitalNomadScore, result.city2.digitalNomadScore),
          IntelligenceCell("Instagrammable", result.city1.instagrammability, result.city2.instagrammability),
          IntelligenceCell("Family Friendly", result.city1.familyFriendliness, result.city2.familyFriendliness),
          IntelligenceCell("Solo Friendly", result.city1.soloFriendliness, result.city2.soloFriendliness),
          IntelligenceCell("Couple Friendly", result.city1.coupleFriendliness, result.city2.coupleFriendliness),
          IntelligenceCell("Local Friendly", result.city1.localFriendliness, result.city2.localFriendliness),
          IntelligenceCell("Visa Ease", result.city1.visaComplexity, result.city2.visaComplexity, true)
        ),

        // Full 12-month seasonal calendar
        el(Text, { style: styles.sectionTitle }, "12-Month Seasonal Calendar"),
        el(View, { style: styles.seasonalTableHeader },
          el(Text, { style: styles.seasonalHeaderMonth }, "Month"),
          el(Text, { style: styles.seasonalHeaderCell }, "Temp"),
          el(Text, { style: styles.seasonalHeaderCell }, "Weather"),
          el(Text, { style: styles.seasonalHeaderCell }, "Crowd"),
          el(Text, { style: styles.seasonalHeaderCell }, "Rain"),
          el(Text, { style: styles.seasonalHeaderSep }, "|"),
          el(Text, { style: styles.seasonalHeaderCell }, "Temp"),
          el(Text, { style: styles.seasonalHeaderCell }, "Weather"),
          el(Text, { style: styles.seasonalHeaderCell }, "Crowd"),
          el(Text, { style: styles.seasonalHeaderCell }, "Rain")
        ),
        ...result.city1.monthlyData.map((md1, i) => {
          const md2 = result.city2.monthlyData[i];
          const isSelected = i === tripContext.month;
          const rowStyle = isSelected ? styles.seasonalRowHighlight : styles.seasonalRow;
          const cellStyle = (val: number, good: boolean) => good ? styles.seasonalCellBest : (val <= 3 ? styles.seasonalCellAvoid : styles.seasonalCell);
          return el(View, { key: `cal-${i}`, style: rowStyle },
            el(Text, { style: styles.seasonalMonthLabel }, MONTHS[i].slice(0, 3)),
            el(Text, { style: styles.seasonalCell }, `${md1.avgTempCelsius}C`),
            el(Text, { style: cellStyle(md1.weatherScore, md1.weatherScore >= 7) }, `${md1.weatherScore}`),
            el(Text, { style: md1.crowdLevel <= 4 ? styles.seasonalCellBest : (md1.crowdLevel >= 8 ? styles.seasonalCellAvoid : styles.seasonalCell) }, `${md1.crowdLevel}`),
            el(Text, { style: md1.rainyDays <= 5 ? styles.seasonalCellBest : (md1.rainyDays >= 15 ? styles.seasonalCellAvoid : styles.seasonalCell) }, `${md1.rainyDays}d`),
            el(Text, { style: styles.seasonalSep }, "|"),
            el(Text, { style: styles.seasonalCell }, `${md2.avgTempCelsius}C`),
            el(Text, { style: cellStyle(md2.weatherScore, md2.weatherScore >= 7) }, `${md2.weatherScore}`),
            el(Text, { style: md2.crowdLevel <= 4 ? styles.seasonalCellBest : (md2.crowdLevel >= 8 ? styles.seasonalCellAvoid : styles.seasonalCell) }, `${md2.crowdLevel}`),
            el(Text, { style: md2.rainyDays <= 5 ? styles.seasonalCellBest : (md2.rainyDays >= 15 ? styles.seasonalCellAvoid : styles.seasonalCell) }, `${md2.rainyDays}d`)
          );
        })
      ),
      Footer(`${sanitize(result.city1.city)} vs ${sanitize(result.city2.city)}  |  Intelligence Dashboard`, "thenextstamptravelco.com")
    ),

    // ══════════════════════════════════════════════════════════════════
    // PAGE 3 — SCORE COMPARISON
    // ══════════════════════════════════════════════════════════════════
    el(Page, { size: "A4", style: styles.page },
      el(View, { style: styles.pageContent },
        el(Text, { style: styles.pageTitle }, "Score Comparison"),

        // Seasonal snapshot for selected month
        el(Text, { style: styles.sectionTitle }, `Seasonal Snapshot — ${monthName}`),
        el(View, { style: styles.tableHeader },
          el(Text, { style: styles.tableHeaderText }, ""),
          el(Text, { style: styles.tableHeaderText }, sanitize(result.city1.city)),
          el(Text, { style: styles.tableHeaderText }, sanitize(result.city2.city))
        ),
        ...[
          ["Weather Score", `${m1.weatherScore}/10`, `${m2.weatherScore}/10`, m1.weatherScore >= m2.weatherScore],
          ["Avg Temperature", `${m1.avgTempCelsius}C`, `${m2.avgTempCelsius}C`, false],
          ["Rainy Days", `${m1.rainyDays} days`, `${m2.rainyDays} days`, m1.rainyDays <= m2.rainyDays],
          ["Crowd Level", `${m1.crowdLevel}/10`, `${m2.crowdLevel}/10`, m1.crowdLevel <= m2.crowdLevel],
          ["Flight Price", `${m1.flightPriceIndex}/10`, `${m2.flightPriceIndex}/10`, m1.flightPriceIndex <= m2.flightPriceIndex],
        ].map(([label, v1, v2, city1Wins], i) =>
          el(View, { key: `snap-${i}`, style: { ...styles.tableRow, backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#FAF7F2" } },
            el(Text, { style: styles.tableCell }, label as string),
            el(Text, { style: city1Wins ? styles.tableCellWinner : styles.tableCell }, v1 as string),
            el(Text, { style: !city1Wins ? styles.tableCellWinner : styles.tableCell }, v2 as string)
          )
        ),

        // Category score bars
        el(Text, { style: styles.sectionTitle }, "Category Scores"),
        el(View, { style: { ...styles.tableHeader, alignItems: "center" as const } },
          el(Text, { style: { ...styles.tableHeaderText, width: 110, flex: 0 } }, ""),
          el(Text, { style: { ...styles.tableHeaderText, width: 20, flex: 0, textAlign: "right" as const } }, ""),
          el(View, { style: { flex: 1, marginHorizontal: 4, alignItems: "center" as const } },
            el(Text, { style: styles.tableHeaderText }, sanitize(result.city1.city))
          ),
          el(View, { style: { flex: 1, marginHorizontal: 4, alignItems: "center" as const } },
            el(Text, { style: styles.tableHeaderText }, sanitize(result.city2.city))
          ),
          el(Text, { style: { ...styles.tableHeaderText, width: 20, flex: 0 } }, "")
        ),
        ...result.categoryScores.map((cat, i) =>
          el(View, { key: `bar-${i}` }, ScoreBar(cat.label, cat.score1, cat.score2, cat.winner))
        ),

        // Where each city dominates
        el(View, { style: styles.dominatesRow },
          el(View, { style: styles.dominatesBox },
            el(Text, { style: styles.dominatesTitle }, "Where It Leads"),
            el(Text, { style: styles.dominatesWinnerCity }, sanitize(result.city1.city)),
            ...city1Wins.map((c, i) => el(Text, { key: `d1-${i}`, style: styles.dominatesItem }, `- ${c.label}: ${c.score1} vs ${c.score2}`))
          ),
          el(View, { style: styles.dominatesBox },
            el(Text, { style: styles.dominatesTitle }, "Where It Leads"),
            el(Text, { style: styles.dominatesWinnerCity }, sanitize(result.city2.city)),
            ...city2Wins.map((c, i) => el(Text, { key: `d2-${i}`, style: styles.dominatesItem }, `- ${c.label}: ${c.score2} vs ${c.score1}`))
          )
        ),

        // Verdict
        el(View, { style: styles.verdictBox },
          el(Text, { style: styles.verdictTitle }, isTie ? "Verdict: Too Close to Call" : `Verdict: ${sanitize(winnerCity.city)} Wins`),
          el(Text, { style: styles.verdictText }, sanitize(result.verdictText))
        )
      ),
      Footer(`${sanitize(result.city1.city)} vs ${sanitize(result.city2.city)}  |  ${today}`, "thenextstamptravelco.com")
    ),

    // ══════════════════════════════════════════════════════════════════
    // PAGES 4 & 5 — CITY BREAKDOWNS
    // ══════════════════════════════════════════════════════════════════
    CityBreakdownPage(result.city1, city1Premium, result.totalScore1),
    CityBreakdownPage(result.city2, city2Premium, result.totalScore2),

    // ══════════════════════════════════════════════════════════════════
    // PAGE 6 — BACK COVER
    // ══════════════════════════════════════════════════════════════════
    el(Page, { size: "A4", style: { ...styles.page, padding: 0 } },
      el(View, { style: styles.backPage },
        el(Text, { style: styles.backBrand }, "The Next Stamp Travel Co."),

        isTie
          ? el(Text, { style: styles.backTitle }, "Two Great Choices")
          : el(Text, { style: styles.backTitle }, `Our Pick: ${sanitize(winnerCity.city)}`),

        el(Text, { style: styles.backSub },
          isTie
            ? `Both ${sanitize(result.city1.city)} and ${sanitize(result.city2.city)} are exceptional matches\nfor your travel style and budget.`
            : `Based on your priorities, ${sanitize(winnerCity.city)} is the stronger choice\nfor this ${travelLabel.toLowerCase()} trip in ${monthName}.`
        ),

        // Trip summary box
        el(View, { style: styles.backSummaryBox },
          el(Text, { style: styles.backSummaryTitle }, "Your Trip Summary"),
          el(View, { style: styles.backSummaryRow },
            el(Text, { style: styles.backSummaryLabel }, "Comparison"),
            el(Text, { style: styles.backSummaryValue }, `${sanitize(result.city1.city)} vs ${sanitize(result.city2.city)}`)
          ),
          el(View, { style: styles.backSummaryRow },
            el(Text, { style: styles.backSummaryLabel }, "Travel Month"),
            el(Text, { style: styles.backSummaryValue }, monthName)
          ),
          el(View, { style: styles.backSummaryRow },
            el(Text, { style: styles.backSummaryLabel }, "Duration"),
            el(Text, { style: styles.backSummaryValue }, `${tripContext.tripLengthDays} days`)
          ),
          el(View, { style: styles.backSummaryRow },
            el(Text, { style: styles.backSummaryLabel }, "Est. Budget"),
            el(Text, { style: styles.backSummaryValue }, `$${estimatedTripCost.toLocaleString()}`)
          ),
          el(View, { style: { ...styles.backSummaryRow, marginBottom: 0 } },
            el(Text, { style: styles.backSummaryLabel }, "Match Scores"),
            el(Text, { style: styles.backSummaryValue }, `${sanitize(result.city1.city)} ${Math.round(result.totalScore1)}%  vs  ${sanitize(result.city2.city)} ${Math.round(result.totalScore2)}%`)
          )
        ),

        // 3 reasons for winner
        !isTie && winnerTopWins.length > 0
          ? el(View, { style: { width: "100%" } },
              el(Text, { style: styles.backReasonsTitle }, `3 Reasons to Choose ${sanitize(winnerCity.city)}`),
              ...winnerTopWins.map((c, i) => {
                const winScore = isWinner1 ? c.score1 : c.score2;
                const loseScore = isWinner1 ? c.score2 : c.score1;
                return el(View, { key: `reason-${i}`, style: styles.backReasonItem },
                  el(Text, { style: styles.backReasonNum }, `${i + 1}`),
                  el(Text, { style: styles.backReasonText }, `${c.label}: ${winScore}/10 vs ${loseScore}/10 — scores ${winScore - loseScore} points higher`)
                );
              })
            )
          : null,

        // Itinerary CTA if shopUrl available
        (result.city1.shopUrl || result.city2.shopUrl)
          ? el(View, { style: styles.backCtaBox },
              el(Text, { style: styles.backCtaLabel }, "Get the Full Itinerary"),
              el(Text, { style: styles.backCtaUrl }, sanitize(result.city1.shopUrl ?? result.city2.shopUrl ?? ""))
            )
          : null,

        el(Text, { style: styles.backUrl }, "thenextstamptravelco.com")
      )
    )
  );
}
