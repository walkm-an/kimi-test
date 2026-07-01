import { getWeatherText } from './codes.js';

export function formatTime(isoTime) {
  const date = new Date(isoTime);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatDate(dateStr) {
  const [month, day] = dateStr.slice(5).split('-');
  return `${month}-${day}`;
}

export function getAqiLevel(aqi) {
  if (aqi <= 50) return '优';
  if (aqi <= 100) return '良';
  if (aqi <= 150) return '轻度污染';
  if (aqi <= 200) return '中度污染';
  if (aqi <= 300) return '重度污染';
  return '严重污染';
}

export function formatCurrent(city, current) {
  const lines = [
    `📍 ${city} 当前天气`,
    `   ${getWeatherText(current.weatherCode)}，${current.temperature}°C`,
    `   湿度 ${current.humidity}%，风速 ${current.windSpeed} km/h`,
  ];
  return lines.join('\n');
}

export function formatHourly(hourly) {
  const lines = ['🕐 未来 24 小时预报'];
  for (const item of hourly) {
    lines.push(`   ${formatTime(item.time)}  ${getWeatherText(item.weatherCode)}  ${item.temperature}°C  风速 ${item.windSpeed} km/h`);
  }
  return lines.join('\n');
}

export function formatDaily(daily) {
  const lines = ['📅 未来 7 天预报'];
  for (const item of daily) {
    lines.push(`   ${formatDate(item.date)}  ${getWeatherText(item.weatherCode)}  ${item.minTemp}°C ~ ${item.maxTemp}°C`);
  }
  return lines.join('\n');
}

export function formatAirQuality(airQuality) {
  const lines = [
    '🌫️ 空气质量',
    `   AQI ${airQuality.aqi}（${getAqiLevel(airQuality.aqi)}）`,
    `   PM2.5 ${airQuality.pm25} μg/m³，PM10 ${airQuality.pm10} μg/m³`,
  ];
  return lines.join('\n');
}

export function formatReport({ weather, airQuality, flags }) {
  const sections = [];

  if (flags.current) {
    sections.push(formatCurrent(weather.city, weather.current));
  }
  if (flags.hourly) {
    sections.push(formatHourly(weather.hourly));
  }
  if (flags.daily) {
    sections.push(formatDaily(weather.daily));
  }
  if (flags.aqi) {
    sections.push(formatAirQuality(airQuality));
  }

  return sections.join('\n\n');
}
