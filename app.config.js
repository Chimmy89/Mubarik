// Extends app.json. Lets us inject a Google Maps Android API key at build time
// from the GOOGLE_MAPS_API_KEY env var (set as a GitHub Actions secret) without
// committing the key. Without it the app still runs; only the Android map tiles
// render blank. app.json remains the source of truth for everything else.
module.exports = ({ config }) => {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (key) {
    config.android = config.android || {};
    config.android.config = {
      ...(config.android.config || {}),
      googleMaps: { apiKey: key },
    };
  }

  // When hosting the web build under a sub-path (e.g. GitHub Pages at
  // /Mubarik/), set EXPO_WEB_BASE_URL so assets and routes resolve correctly.
  // Left unset for root hosting (Vercel), so this is a no-op there.
  const baseUrl = process.env.EXPO_WEB_BASE_URL;
  if (baseUrl) {
    config.experiments = { ...(config.experiments || {}), baseUrl };
  }

  return config;
};
