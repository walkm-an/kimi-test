import { fetchWeather } from './weather.js';
import { fetchAirQuality } from './airquality.js';
import { formatReport } from './formatter.js';

export function parseArgs(argv) {
  const flags = { current: false, hourly: false, daily: false, aqi: false };
  const args = [];
  let hasExplicitFlag = false;

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--current') { flags.current = true; hasExplicitFlag = true; }
    else if (arg === '--hourly') { flags.hourly = true; hasExplicitFlag = true; }
    else if (arg === '--daily') { flags.daily = true; hasExplicitFlag = true; }
    else if (arg === '--aqi') { flags.aqi = true; hasExplicitFlag = true; }
    else args.push(arg);
  }

  if (!hasExplicitFlag) {
    flags.current = true;
    flags.hourly = true;
    flags.daily = true;
    flags.aqi = true;
  } else if (flags.hourly || flags.daily || flags.aqi) {
    flags.current = true;
  }

  return {
    city: args.join(' ').trim(),
    flags,
  };
}

function printUsage() {
  console.log('用法：weather [选项] <城市名>');
  console.log('');
  console.log('选项：');
  console.log('  --current   只显示当前天气');
  console.log('  --hourly    显示当前天气 + 未来 24 小时预报');
  console.log('  --daily     显示当前天气 + 未来 7 天预报');
  console.log('  --aqi       显示当前天气 + 空气质量');
  console.log('');
  console.log('示例：');
  console.log('  weather 北京');
  console.log('  weather --hourly 上海');
}

export async function main() {
  const { city, flags } = parseArgs(process.argv);

  if (!city) {
    printUsage();
    process.exit(1);
  }

  try {
    const [weather, airQuality] = await Promise.all([
      fetchWeather(city),
      fetchAirQuality(city),
    ]);

    const output = formatReport({ weather, airQuality, flags });
    console.log(output);
    process.exit(0);
  } catch (err) {
    console.error(`❌ ${err.message}`);
    process.exit(2);
  }
}
