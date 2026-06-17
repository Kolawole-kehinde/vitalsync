type LocationResult = {
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
};

export async function getLocation(ipAddress?: string): Promise<LocationResult> {
  if (
    !ipAddress ||
    ipAddress === "unknown" ||
    ipAddress === "::1" ||
    ipAddress === "127.0.0.1"
  ) {
    return {};
  }

  try {
    const response = await fetch(
      `http://ip-api.com/json/${ipAddress}`
    );

    if (!response.ok) {
      return {};
    }

    const data = await response.json();

    if (data.status !== "success") {
      return {};
    }

    return {
      country: data.country,
      city: data.city,
      latitude: data.lat,
      longitude: data.lon,
    };
  } catch {
    return {};
  }
}