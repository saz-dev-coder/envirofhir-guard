/**
 * Environmental & Meteorological Evidence Verification Service
 * Integrates with Open-Meteo public API with strict abort timeouts,
 * graceful fallback to DemoWeatherProvider, and transparent status labeling.
 */

import { WeatherEvidence } from '../types';

/**
 * High-fidelity deterministic fallback provider
 */
function getDeterministicDemoWeather(
  latitude: number,
  longitude: number,
  isStormScenario: boolean
): WeatherEvidence {
  if (isStormScenario) {
    return {
      source: 'DEMO_WEATHER_PROVIDER',
      status: 'DEGRADED',
      temperatureC: 28.4,
      relativeHumidity: 94,
      precipitationMm: 34.2,
      rainfallMm: 32.0,
      windSpeedKmh: 42.5,
      condition: 'Severe Precipitation / Monsoon Runoff',
      retrievedAt: new Date().toISOString(),
      latencyMs: 14,
      environmentalCorrelation:
        'High precipitation (34.2 mm) strongly correlates with severe sediment runoff, increased turbidity, and temporary acid pulse into watershed.',
    };
  }

  return {
    source: 'DEMO_WEATHER_PROVIDER',
    status: 'DEGRADED',
    temperatureC: 29.8,
    relativeHumidity: 68,
    precipitationMm: 0.0,
    rainfallMm: 0.0,
    windSpeedKmh: 11.2,
    condition: 'Clear / Dry Industrial Conditions',
    retrievedAt: new Date().toISOString(),
    latencyMs: 12,
    environmentalCorrelation:
      'Dry weather conditions observed. pH drop cannot be attributed to meteorological rainfall dilution; suggests point-source or sensor failure.',
  };
}

/**
 * Queries Open-Meteo live API with graceful timeout and automatic fallback
 */
export async function queryWeatherEvidence(
  latitude: number,
  longitude: number,
  isStormScenario = false
): Promise<WeatherEvidence> {
  const startTime = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s timeout safeguard

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude.toFixed(
      4
    )}&longitude=${longitude.toFixed(
      4
    )}&current=temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m`;

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo HTTP ${response.status}`);
    }

    const data = await response.json();
    const duration = Math.round((performance.now() - startTime) * 10) / 10;
    const current = data.current || {};

    const temp = current.temperature_2m ?? 29.5;
    const humidity = current.relative_humidity_2m ?? 70;
    const precip = current.precipitation ?? 0;
    const rain = current.rain ?? 0;
    const wind = current.wind_speed_10m ?? 12;

    let condition = 'Dry / Clear';
    if (precip > 5) condition = 'Heavy Rainfall';
    else if (precip > 0.5) condition = 'Moderate Rain';
    else if (humidity > 85) condition = 'Humid / Overcast';

    let correlation = '';
    if (precip > 5) {
      correlation = `Active rainfall (${precip} mm) corroborates sudden turbidity surge and runoff dilution in the watershed zone.`;
    } else {
      correlation = `Dry meteorological conditions (${precip} mm rain). Telemetry anomaly is independent of immediate precipitation events.`;
    }

    return {
      source: 'OPEN_METEO_LIVE',
      status: 'LIVE',
      temperatureC: Math.round(temp * 10) / 10,
      relativeHumidity: Math.round(humidity),
      precipitationMm: Math.round(precip * 10) / 10,
      rainfallMm: Math.round(rain * 10) / 10,
      windSpeedKmh: Math.round(wind * 10) / 10,
      condition,
      retrievedAt: new Date().toISOString(),
      latencyMs: duration,
      environmentalCorrelation: correlation,
    };
  } catch (_err) {
    clearTimeout(timeoutId);
    // Return gracefully labeled degraded fallback
    return getDeterministicDemoWeather(latitude, longitude, isStormScenario);
  }
}
