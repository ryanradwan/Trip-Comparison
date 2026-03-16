import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadCity } from "../src/lib/cities";
import { compareCities } from "../src/lib/scoring";
import { generateComparisonPdfBuffer } from "../src/lib/generatePdfServer";
import { getDefaultTripContext } from "../src/lib/constants";
import { SLIDER_CATEGORIES } from "../src/lib/constants";
import { TravelerWeights } from "../src/lib/types";

const CITY1 = process.argv[2] ?? "barcelona";
const CITY2 = process.argv[3] ?? "istanbul";

function defaultWeights(): TravelerWeights {
  const w: TravelerWeights = {};
  for (const cat of SLIDER_CATEGORIES) w[cat.key] = cat.defaultWeight;
  return w;
}

async function main() {
  const [city1, city2] = await Promise.all([loadCity(CITY1), loadCity(CITY2)]);
  if (!city1 || !city2) throw new Error(`City not found: ${CITY1} or ${CITY2}`);

  const tripContext = { ...getDefaultTripContext(), month: 3, tripLengthDays: 10, dailyBudget: 150 };
  const weights = defaultWeights();

  console.log(`Generating PDF for ${city1.city} vs ${city2.city}...`);
  const result = compareCities(city1, city2, tripContext, weights);
  const buffer = await generateComparisonPdfBuffer(result, city1.premium, city2.premium);

  const outPath = path.join(
    process.env.HOME!,
    "Desktop",
    `${city1.city.replace(/\s+/g, "-")}-vs-${city2.city.replace(/\s+/g, "-")}-Trip-Report.pdf`
  );
  fs.writeFileSync(outPath, buffer);
  console.log(`✓ Saved to ${outPath}`);
}

main().catch(console.error);
