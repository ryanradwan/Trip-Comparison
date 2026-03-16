import { CityProfile } from "./types";

// Affiliate link generator — uses city airport code for precise deep-links
// Sign up: Skyscanner, Booking.com, GetYourGuide, Viator, Hostelworld

export interface AffiliateLinks {
  flights: string;
  hotels: string;
  tours: string;
  viator: string;
  hostel?: string;
}

export function getAffiliateLinks(city: CityProfile): AffiliateLinks {
  const cityName = encodeURIComponent(city.city);
  const airportCode = city.airportCode;

  return {
    flights: `https://www.skyscanner.net/transport/flights-to/${airportCode}/?utm_source=thenextstamp&utm_medium=referral`,
    hotels: `https://www.booking.com/searchresults.html?ss=${cityName}&utm_source=thenextstamp&utm_medium=referral`,
    tours: `https://www.getyourguide.com/s/?q=${cityName}&partner_id=66EZOEX`,
    viator: `https://www.viator.com/search/${cityName}?pid=P00122757&mcid=42383&medium=link`,
    hostel: `https://www.hostelworld.com/search?search_keywords=${cityName}&utm_source=thenextstamp&utm_medium=referral`,
  };
}
