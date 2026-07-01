import { geocode } from './geocode.js';

const AIR_QUALITY_API = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export async function fetchAirQuality(city) {
  const location = await geocode(city);

  const url = new URL(AIR_QUALITY_API);
  url.searchParams.set('latitude', String(location.latitude));
  url.searchParams.set('longitude', String(location.longitude));
  url.searchParams.set('current', 'us_aqi,pm10,pm2_5');

  let response;
  try {
    response = await fetch(url);
  } catch (err) {
    throw new Error(`网络请求失败：${err.message}`);
  }

  if (!response.ok) {
    throw new Error(`空气质量服务返回错误：${response.status}`);
  }

  const data = await response.json();

  return {
    city: location.name,
    country: location.country,
    time: data.current.time,
    aqi: data.current.us_aqi,
    pm10: data.current.pm10,
    pm25: data.current.pm2_5,
  };
}
