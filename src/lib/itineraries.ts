export interface ItineraryProduct {
  cityLabel: string;
  name: string;
  description: string;
  url: string;
  highlights: string[];
}

// Map of city ID → itinerary product
// Add new entries here as you publish more itineraries
export const ITINERARY_PRODUCTS: Record<string, ItineraryProduct> = {
  lisbon: {
    cityLabel: "Lisbon",
    name: "4 Days in Lisbon",
    description: "A hand-crafted day-by-day guide to Lisbon's best neighbourhoods, food, viewpoints, and hidden gems.",
    url: "https://thenextstamptravelco.com/product/4-days-in-lisbon/",
    highlights: ["Day-by-day schedule", "Neighbourhood guides", "Restaurant & café picks", "Transport tips"],
  },
  porto: {
    cityLabel: "Porto",
    name: "2 Days in Porto",
    description: "Make the most of a Porto weekend — wine cellars, riverside walks, tiled facades, and the best francesinhas in town.",
    url: "https://thenextstamptravelco.com/product/2-days-in-porto/",
    highlights: ["48-hour itinerary", "Wine cellar visits", "Best viewpoints", "Where to eat & drink"],
  },
  barcelona: {
    cityLabel: "Barcelona",
    name: "4 Days in Barcelona",
    description: "Four days packed with Gaudí, Gothic Quarter lanes, beach time, and the food markets every visitor should know.",
    url: "https://thenextstamptravelco.com/product/4-days-in-barcelona/",
    highlights: ["Day-by-day schedule", "Gaudí landmarks", "Beach & neighbourhood guides", "Food market tips"],
  },
  madrid: {
    cityLabel: "Madrid",
    name: "3 Days in Madrid",
    description: "Three full days in Spain's capital — world-class museums, tapas crawls, rooftop bars, and day-trip options.",
    url: "https://thenextstamptravelco.com/product/3-days-in-madrid/",
    highlights: ["Museum circuit", "Tapas bar guide", "Rooftop recommendations", "Day trip options"],
  },
  paris: {
    cityLabel: "Paris",
    name: "5-Day Paris Itinerary",
    description: "Five days in the City of Light done right — beyond the Eiffel Tower to the arrondissements, bistros, and galleries that make Paris Paris.",
    url: "https://thenextstamptravelco.com/product/5-day-paris-itinerary/",
    highlights: ["5 full days planned", "Neighbourhood walks", "Bistro & café picks", "Skip-the-queue tips"],
  },
  rome: {
    cityLabel: "Rome",
    name: "3 Days in Rome",
    description: "Three days to hit the Colosseum, Vatican, Trastevere, and every plate of cacio e pepe in between.",
    url: "https://thenextstamptravelco.com/product/3-days-in-rome/",
    highlights: ["Ancient Rome circuit", "Vatican visit guide", "Best trattorias", "Neighbourhood strolls"],
  },
  marrakech: {
    cityLabel: "Marrakech",
    name: "Marrakech Travel Guide",
    description: "Navigate the medina with confidence — souks, riads, hammams, day trips to the Atlas Mountains, and what to skip.",
    url: "https://thenextstamptravelco.com/product/marrakech-travel-guide/",
    highlights: ["Medina navigation", "Souk shopping guide", "Riad recommendations", "Day trips & excursions"],
  },
  luxor: {
    cityLabel: "Luxor",
    name: "2 Days in Luxor",
    description: "Two days among the greatest open-air museum on earth — Valley of the Kings, Karnak Temple, and Nile felucca rides.",
    url: "https://thenextstamptravelco.com/product/2-days-in-luxor/",
    highlights: ["Valley of the Kings", "Karnak & Luxor Temples", "Nile experiences", "Practical travel tips"],
  },
  dubai: {
    cityLabel: "Dubai",
    name: "5 Days in Dubai",
    description: "Five days in the UAE's most spectacular city — from Burj Khalifa sunsets to old Dubai's spice souks and desert safaris.",
    url: "https://thenextstamptravelco.com/product/5-days-in-dubai/",
    highlights: ["Burj Khalifa visit", "Desert safari", "Old Dubai & souks", "Best restaurants & rooftops"],
  },
  "new-york-city": {
    cityLabel: "New York City",
    name: "5 Days in New York City",
    description: "Five days navigating the greatest city on earth — iconic neighbourhoods, world-class food, and the hidden gems most tourists never find.",
    url: "https://thenextstamptravelco.com/product/new-york-5-day-itinerary-guide/",
    highlights: ["Day-by-day schedule", "Neighbourhood guides", "Best restaurants & bars", "Transport & logistics tips"],
  },
  montreal: {
    cityLabel: "Montreal",
    name: "4 Days in Montreal",
    description: "Four days in Canada's most vibrant city — French-Canadian culture, incredible food, festivals, and the best of Old Montreal.",
    url: "https://thenextstamptravelco.com/product/montreal-4-day-itinerary-guide/",
    highlights: ["Day-by-day schedule", "Old Montreal highlights", "Food & café guide", "Culture & festival tips"],
  },
  // Japan itinerary applies to all Japan cities
  tokyo: {
    cityLabel: "Japan",
    name: "9-Day Japan Itinerary",
    description: "The ultimate first-timer's guide to Japan — Tokyo, Kyoto, Osaka, and the bullet train routes that connect them perfectly.",
    url: "https://thenextstamptravelco.com/product/9-day-japan-itinerary/",
    highlights: ["Tokyo, Kyoto & Osaka", "Bullet train guide", "Culture & food tips", "Day-by-day schedule"],
  },
  kyoto: {
    cityLabel: "Japan",
    name: "9-Day Japan Itinerary",
    description: "The ultimate first-timer's guide to Japan — Tokyo, Kyoto, Osaka, and the bullet train routes that connect them perfectly.",
    url: "https://thenextstamptravelco.com/product/9-day-japan-itinerary/",
    highlights: ["Tokyo, Kyoto & Osaka", "Bullet train guide", "Culture & food tips", "Day-by-day schedule"],
  },
  osaka: {
    cityLabel: "Japan",
    name: "9-Day Japan Itinerary",
    description: "The ultimate first-timer's guide to Japan — Tokyo, Kyoto, Osaka, and the bullet train routes that connect them perfectly.",
    url: "https://thenextstamptravelco.com/product/9-day-japan-itinerary/",
    highlights: ["Tokyo, Kyoto & Osaka", "Bullet train guide", "Culture & food tips", "Day-by-day schedule"],
  },
};

/**
 * Returns the unique itinerary products for the two city IDs.
 * Deduplicates — if both cities map to the same itinerary (e.g. Tokyo + Kyoto → Japan),
 * only one card is shown.
 */
export function getItinerariesForCities(id1: string, id2: string): ItineraryProduct[] {
  const seen = new Set<string>();
  const results: ItineraryProduct[] = [];

  for (const id of [id1, id2]) {
    const product = ITINERARY_PRODUCTS[id];
    if (product && !seen.has(product.url)) {
      seen.add(product.url);
      results.push(product);
    }
  }

  return results;
}
