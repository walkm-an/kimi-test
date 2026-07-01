import { geocode } from './geocode.js';

const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeather(city) {
  const location = await geocode(city);

  const url = new URL(WEATHER_API);
  url.searchParams.set('latitude', String(location.latitude));
  url.searchParams.set('longitude', String(location.longitude));
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m');
  url.searchParams.set('hourly', 'temperature_2m,weather_code,wind_speed_10m');
  url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min');
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '7');

  let response;
  try {
    response = await fetch(url);
  } catch (err) {
    throw new Error(`网络请求失败：${err.message}`);
  }

  if (!response.ok) {
    throw new Error(`天气服务返回错误：${response.status}`);
  }

  const data = await response.json();
  const currentTime = data.current.time;

  return {
    city: location.name,
    country: location.country,
    current: {
      time: currentTime,
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      weatherCode: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
    },
    hourly: sliceNext24Hours(data.hourly, currentTime),
    daily: data.daily.time.map((date, index) => ({
      date,
      weatherCode: data.daily.weather_code[index],
      maxTemp: data.daily.temperature_2m_max[index],
      minTemp: data.daily.temperature_2m_min[index],
    })),
  };
}

function sliceNext24Hours(hourly, currentTime) {
  const startIndex = hourly.time.findIndex((t) => t >= currentTime);
  const index = startIndex === -1 ? 0 : startIndex;
  const endIndex = Math.min(index + 24, hourly.time.length);

  const result = [];
  for (let i = index; i < endIndex; i++) {
    result.push({
      time: hourly.time[i],
      temperature: hourly.temperature_2m[i],
      weatherCode: hourly.weather_code[i],
      windSpeed: hourly.wind_speed_10m[i],
    });
  }
  return result;
}
