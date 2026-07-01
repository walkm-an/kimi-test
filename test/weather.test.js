import assert from 'node:assert';
import { fetchWeather } from '../src/weather.js';

async function testFetchWeather() {
  console.log('Testing fetchWeather(北京)...');
  const result = await fetchWeather('北京');

  assert.strictEqual(typeof result, 'object', 'should return an object');
  assert(result.city, 'should have city name');
  assert(result.current, 'should have current weather');
  assert(typeof result.current.temperature === 'number', 'current.temperature should be a number');
  assert(typeof result.current.humidity === 'number', 'current.humidity should be a number');
  assert(typeof result.current.windSpeed === 'number', 'current.windSpeed should be a number');
  assert(typeof result.current.weatherCode === 'number', 'current.weatherCode should be a number');

  assert(Array.isArray(result.hourly), 'hourly should be an array');
  assert.strictEqual(result.hourly.length, 24, 'hourly should have 24 items');
  assert(typeof result.hourly[0].time === 'string', 'hourly[0].time should be a string');
  assert(typeof result.hourly[0].temperature === 'number', 'hourly[0].temperature should be a number');

  assert(Array.isArray(result.daily), 'daily should be an array');
  assert.strictEqual(result.daily.length, 7, 'daily should have 7 items');
  assert(typeof result.daily[0].date === 'string', 'daily[0].date should be a string');
  assert(typeof result.daily[0].maxTemp === 'number', 'daily[0].maxTemp should be a number');
  assert(typeof result.daily[0].minTemp === 'number', 'daily[0].minTemp should be a number');

  console.log('✅ fetchWeather test passed');
  console.log('Current:', result.current);
  console.log('Hourly[0]:', result.hourly[0]);
  console.log('Daily[0]:', result.daily[0]);
}

async function testFetchWeatherNotFound() {
  console.log('Testing fetchWeather(NotARealCityXYZ)...');
  try {
    await fetchWeather('NotARealCityXYZ');
    assert.fail('should throw for non-existent city');
  } catch (err) {
    assert(err.message.includes('未找到'), 'error message should mention 未找到');
    console.log('✅ fetchWeather not-found test passed');
  }
}

testFetchWeather()
  .then(testFetchWeatherNotFound)
  .then(() => {
    console.log('All weather tests passed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ weather test failed:', err);
    process.exit(1);
  });
