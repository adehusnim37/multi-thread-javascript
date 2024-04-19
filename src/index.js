const { Worker } = require('worker_threads');
const path = require('path');
const os = require('os');

async function main() {
  const numIterations = 10;
  const numCPUs = os.cpus().length;
  console.log(`Main thread: Detected ${numCPUs} CPUs.`);

  const workerPath = path.resolve(__dirname, 'worker.js');
  let workers = [];

  // Initialize workers
  for (let i = 0; i < numCPUs; i++) {
    const worker = new Worker(workerPath);
    workers.push(worker);
  }

  console.time("Processing time");
  let promises = [];

  // Dispatch tasks to workers
  for (let i = 0; i < numIterations; i++) {
    const workerIndex = i % numCPUs;
    const worker = workers[workerIndex];
    const promise = new Promise((resolve, reject) => {
      worker.once('message', (event) => {
        console.log(`Worker ${event.workerId} completed task ${i + 1}: ${event.result}`);
        resolve(event);
      });

      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });

      worker.postMessage({
        type: i % 2 === 0 ? 'encode' : 'decode',
        text: i % 2 === 0 ? 'Hello, world!' : 'SGVsbG8sIHdvcmxkIQ==',
        workerId: workerIndex + 1
      });
    });

    promises.push(promise);
  }

  // Wait for all tasks to complete
  await Promise.all(promises);
  console.timeEnd("Processing time");

  // Terminate all workers
  workers.forEach(worker => worker.terminate());
  console.log("All workers terminated.");
  console.timeEnd("Processing time multi-threaded");
}

main().catch(err => console.error(err));
