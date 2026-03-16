import { MetadataRoute } from "next";
import { getAllComparisonSlugs, getCityIndex } from "@/lib/cities";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_URL || "https://compare.thenextstamptravelco.com";
  const slugs = getAllComparisonSlugs();
  const cities = getCityIndex().filter((c) => c.enabled);

  const comparisons: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${base}/compare/${slug}`,
    lastModified: new Date("2025-06-01"),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${base}/destinations`,
    lastModified: new Date("2025-06-01"),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/destinations`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...comparisons,
  ];
}
