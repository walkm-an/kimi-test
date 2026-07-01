const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';

export async function geocode(city) {
  const url = new URL(GEOCODING_API);
  url.searchParams.set('name', city);
  url.searchParams.set('count', '1');
  url.searchParams.set('language', 'zh');

  let response;
  try {
    response = await fetch(url);
  } catch (err) {
    throw new Error(`网络请求失败：${err.message}`);
  }

  if (!response.ok) {
    throw new Error(`地理编码服务返回错误：${response.status}`);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`未找到城市「${city}」，请检查城市名是否正确`);
  }

  const result = data.results[0];
  return {
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
    timezone: result.timezone,
  };
}
