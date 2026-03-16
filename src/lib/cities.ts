import { CityProfile, CityIndexEntry } from "./types";
import { generateSlug } from "./utils";

export async function loadCity(id: string): Promise<CityProfile | null> {
  try {
    const data = await import(`@/data/cities/${id}.json`);
    return data.default as CityProfile;
  } catch {
    return null;
  }
}

// Memoized at module level — index never changes at runtime
// eslint-disable-next-line @typescript-eslint/no-require-imports
let _cityIndex: CityIndexEntry[] | null = null;
export function getCityIndex(): CityIndexEntry[] {
  if (!_cityIndex) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    _cityIndex = require("@/data/cities/_index.json") as CityIndexEntry[];
  }
  return _cityIndex;
}

// Precomputed Set of valid city IDs for O(1) lookup
let _cityIdSet: Set<string> | null = null;
function getCityIdSet(): Set<string> {
  if (!_cityIdSet) {
    _cityIdSet = new Set(getCityIndex().map((c) => c.id));
  }
  return _cityIdSet;
}

export function getAllComparisonSlugs(): string[] {
  const cities = getCityIndex().filter((c) => c.enabled);
  const slugs: string[] = [];
  for (let i = 0; i < cities.length; i++) {
    for (let j = i + 1; j < cities.length; j++) {
      slugs.push(generateSlug(cities[i].id, cities[j].id));
    }
  }
  return slugs;
}

export function parseSlug(slug: string): [string, string] | null {
  const parts = slug.split("-vs-");
  if (parts.length < 2) return null;
  const cityIds = getCityIdSet();
  // Try all split positions — handles city IDs containing hyphens (e.g., ho-chi-minh-city)
  for (let i = 1; i < parts.length; i++) {
    const id1 = parts.slice(0, i).join("-vs-");
    const id2 = parts.slice(i).join("-vs-");
    if (cityIds.has(id1) && cityIds.has(id2)) {
      return [id1, id2];
    }
  }
  return null;
}
