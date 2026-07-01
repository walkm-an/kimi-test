import assert from 'node:assert';
import { fetchAirQuality } from '../src/airquality.js';

async function testFetchAirQuality() {
  console.log('Testing fetchAirQuality(北京)...');
  const result = await fetchAirQuality('北京');

  assert.strictEqual(typeof result, 'object', 'should return an object');
  assert(result.city, 'should have city name');
  assert(typeof result.aqi === 'number', 'aqi should be a number');
  assert(typeof result.pm10 === 'number', 'pm10 should be a number');
  assert(typeof result.pm25 === 'number', 'pm25 should be a number');

  console.log('✅ fetchAirQuality test passed:', result);
}

async function testFetchAirQualityNotFound() {
  console.log('Testing fetchAirQuality(NotARealCityXYZ)...');
  try {
    await fetchAirQuality('NotARealCityXYZ');
    assert.fail('should throw for non-existent city');
  } catch (err) {
    assert(err.message.includes('未找到'), 'error message should mention 未找到');
    console.log('✅ fetchAirQuality not-found test passed');
  }
}

testFetchAirQuality()
  .then(testFetchAirQualityNotFound)
  .then(() => {
    console.log('All air quality tests passed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ air quality test failed:', err);
    process.exit(1);
  });
