import assert from 'node:assert';
import { geocode } from '../src/geocode.js';

async function testGeocode() {
  console.log('Testing geocode(北京)...');
  const result = await geocode('北京');
  assert.strictEqual(typeof result, 'object', 'should return an object');
  assert.strictEqual(result.name, '北京', 'name should be 北京');
  assert.strictEqual(result.country, '中国', 'country should be 中国');
  assert(typeof result.latitude === 'number', 'latitude should be a number');
  assert(typeof result.longitude === 'number', 'longitude should be a number');
  console.log('✅ geocode test passed:', result);
}

async function testGeocodeNotFound() {
  console.log('Testing geocode(NotARealCityXYZ)...');
  try {
    await geocode('NotARealCityXYZ');
    assert.fail('should throw for non-existent city');
  } catch (err) {
    assert(err.message.includes('未找到'), 'error message should mention 未找到');
    console.log('✅ geocode not-found test passed');
  }
}

testGeocode()
  .then(testGeocodeNotFound)
  .then(() => {
    console.log('All geocode tests passed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ geocode test failed:', err);
    process.exit(1);
  });
