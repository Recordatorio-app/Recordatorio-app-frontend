import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://recordatorio-app.vercel.app",
      lastModified: new Date(),
    },
    {
      url: "https://recordatorio-app.vercel.app/login",
      lastModified: new Date(),
    },
  ];
}
