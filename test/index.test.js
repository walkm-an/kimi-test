import assert from 'node:assert';
import { parseArgs } from '../src/index.js';

function testParseArgs() {
  console.log('Testing parseArgs...');

  const case1 = parseArgs(['node', 'weather.js', '北京']);
  assert.deepStrictEqual(case1.city, '北京');
  assert.deepStrictEqual(case1.flags, { current: true, hourly: true, daily: true, aqi: true });

  const case2 = parseArgs(['node', 'weather.js', '--current', '北京']);
  assert.deepStrictEqual(case2.city, '北京');
  assert.deepStrictEqual(case2.flags, { current: true, hourly: false, daily: false, aqi: false });

  const case3 = parseArgs(['node', 'weather.js', '--hourly', '上海']);
  assert.deepStrictEqual(case3.city, '上海');
  assert.deepStrictEqual(case3.flags, { current: true, hourly: true, daily: false, aqi: false });

  const case4 = parseArgs(['node', 'weather.js', '--daily', '广州']);
  assert.deepStrictEqual(case4.city, '广州');
  assert.deepStrictEqual(case4.flags, { current: true, hourly: false, daily: true, aqi: false });

  const case5 = parseArgs(['node', 'weather.js', '--aqi', '成都']);
  assert.deepStrictEqual(case5.city, '成都');
  assert.deepStrictEqual(case5.flags, { current: true, hourly: false, daily: false, aqi: true });

  const case6 = parseArgs(['node', 'weather.js', 'New', 'York']);
  assert.deepStrictEqual(case6.city, 'New York');
  assert.deepStrictEqual(case6.flags, { current: true, hourly: true, daily: true, aqi: true });

  const case7 = parseArgs(['node', 'weather.js']);
  assert.deepStrictEqual(case7.city, '');

  console.log('✅ parseArgs test passed');
}

testParseArgs();
