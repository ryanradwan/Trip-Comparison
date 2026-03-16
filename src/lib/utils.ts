export function generateSlug(city1Id: string, city2Id: string): string {
  const sorted = [city1Id, city2Id].sort();
  return `${sorted[0]}-vs-${sorted[1]}`;
}


export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}
