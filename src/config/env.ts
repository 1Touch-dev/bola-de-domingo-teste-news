export const envConfig = {
  apiBaseUrl: (process.env.NEXT_PUBLIC_CMS_URL || "https://api.boladedomingo.com/api").replace(/\/$/, ""),
  targetWebsite: process.env.NEXT_PUBLIC_WEBSITE_KEY || "boladedomingo.com",
};
