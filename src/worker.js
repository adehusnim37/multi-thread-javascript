const { parentPort } = require('worker_threads');

parentPort.on('message', (data) => {
  console.log(`Worker ${data.workerId} received task.`);
  let result;
  if (data.type === 'encode') {
    result = Buffer.from(data.text).toString('base64');
  } else {
    result = Buffer.from(data.text, 'base64').toString('utf-8');
  }
  parentPort.postMessage({ result: result, workerId: data.workerId });
});
