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
  return config;
};
