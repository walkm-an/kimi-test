import assert from 'node:assert';
import { formatReport, formatCurrent, formatHourly, formatDaily, formatAirQuality } from '../src/formatter.js';
import { getWeatherText } from '../src/codes.js';

function testGetWeatherText() {
  console.log('Testing getWeatherText...');
  assert.strictEqual(getWeatherText(0), '晴');
  assert.strictEqual(getWeatherText(1), '多云');
  assert.strictEqual(getWeatherText(3), '阴');
  assert.strictEqual(getWeatherText(51), '小雨');
  assert.strictEqual(getWeatherText(53), '中雨');
  assert.strictEqual(getWeatherText(61), '小雨');
  assert.strictEqual(getWeatherText(63), '中雨');
  assert.strictEqual(getWeatherText(95), '雷雨');
  assert.strictEqual(getWeatherText(999), '未知');
  console.log('✅ getWeatherText test passed');
}

function testFormatCurrent() {
  console.log('Testing formatCurrent...');
  const current = {
    time: '2026-07-01T23:30',
    temperature: 26.1,
    humidity: 74,
    weatherCode: 0,
    windSpeed: 5.4,
  };
  const result = formatCurrent('北京', current);
  assert(result.includes('北京'), 'should include city name');
  assert(result.includes('26.1°C'), 'should include temperature');
  assert(result.includes('晴'), 'should include weather text');
  assert(result.includes('74%'), 'should include humidity');
  assert(result.includes('5.4 km/h'), 'should include wind speed');
  console.log('✅ formatCurrent test passed');
  console.log(result);
}

function testFormatHourly() {
  console.log('Testing formatHourly...');
  const hourly = [
    { time: '2026-07-02T00:00', temperature: 25.8, weatherCode: 0, windSpeed: 4.6 },
    { time: '2026-07-02T01:00', temperature: 24.5, weatherCode: 1, windSpeed: 3.2 },
  ];
  const result = formatHourly(hourly);
  assert(result.includes('未来 24 小时'), 'should include title');
  assert(result.includes('00:00'), 'should include time');
  assert(result.includes('25.8°C'), 'should include temperature');
  console.log('✅ formatHourly test passed');
  console.log(result);
}

function testFormatDaily() {
  console.log('Testing formatDaily...');
  const daily = [
    { date: '2026-07-01', weatherCode: 51, maxTemp: 31.1, minTemp: 21.5 },
    { date: '2026-07-02', weatherCode: 0, maxTemp: 35.1, minTemp: 23.2 },
  ];
  const result = formatDaily(daily);
  assert(result.includes('未来 7 天'), 'should include title');
  assert(result.includes('07-01'), 'should include date');
  assert(result.includes('31.1°C'), 'should include max temp');
  assert(result.includes('21.5°C'), 'should include min temp');
  console.log('✅ formatDaily test passed');
  console.log(result);
}

function testFormatAirQuality() {
  console.log('Testing formatAirQuality...');
  const aqi = { city: '北京', aqi: 155, pm10: 115.5, pm25: 111.5 };
  const result = formatAirQuality(aqi);
  assert(result.includes('空气质量'), 'should include title');
  assert(result.includes('155'), 'should include AQI value');
  assert(result.includes('中度污染'), 'should include AQI level');
  console.log('✅ formatAirQuality test passed');
  console.log(result);
}

function testFormatReport() {
  console.log('Testing formatReport with flags...');
  const weather = {
    city: '北京',
    current: { time: '2026-07-01T23:30', temperature: 26.1, humidity: 74, weatherCode: 0, windSpeed: 5.4 },
    hourly: [{ time: '2026-07-02T00:00', temperature: 25.8, weatherCode: 0, windSpeed: 4.6 }],
    daily: [{ date: '2026-07-01', weatherCode: 51, maxTemp: 31.1, minTemp: 21.5 }],
  };
  const airQuality = { city: '北京', aqi: 155, pm10: 115.5, pm25: 111.5 };

  const full = formatReport({ weather, airQuality, flags: { current: true, hourly: true, daily: true, aqi: true } });
  assert(full.includes('当前天气'), 'full report should include current');
  assert(full.includes('未来 24 小时'), 'full report should include hourly');
  assert(full.includes('未来 7 天'), 'full report should include daily');
  assert(full.includes('空气质量'), 'full report should include aqi');

  const currentOnly = formatReport({ weather, airQuality, flags: { current: true, hourly: false, daily: false, aqi: false } });
  assert(currentOnly.includes('当前天气'), 'current-only should include current');
  assert(!currentOnly.includes('未来 24 小时'), 'current-only should not include hourly');

  console.log('✅ formatReport test passed');
}

try {
  testGetWeatherText();
  testFormatCurrent();
  testFormatHourly();
  testFormatDaily();
  testFormatAirQuality();
  testFormatReport();
  console.log('\nAll formatter tests passed');
  process.exit(0);
} catch (err) {
  console.error('❌ formatter test failed:', err);
  process.exit(1);
}
