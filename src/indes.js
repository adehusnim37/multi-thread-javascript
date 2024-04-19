const os = require('os');
const { performance } = require('perf_hooks');

function encode(text) {
  return Buffer.from(text).toString('base64');
}

function decode(encodedText) {
  return Buffer.from(encodedText, 'base64').toString('utf-8');
}

function main() {
  const numIterations = 10;
  console.log(`Main thread: Detected ${os.cpus().length} CPUs.`);

  console.time("Single-threaded processing time");
  let startTime = performance.now();

  for (let i = 0; i < numIterations; i++) {
    let result;
    if (i % 2 === 0) {
      result = encode('Hello, world!');
    } else {
      result = decode('SGVsbG8sIHdvcmxkIQ==');
    }
    console.log(`Iteration ${i + 1}: Result is ${result}`);
  }

  let endTime = performance.now();
  console.timeEnd("Single-threaded processing time");
  console.log(`Total execution time: ${(endTime - startTime).toFixed(2)} milliseconds.`);
}

main();
