import http from "http";

const options = {
  host: 'localhost',
  port: 5000,
  path: '/health',
  timeout: 2000
};

const request = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.log('HEALTH CHECK ERROR', err);
  process.exit(1);
});

request.on('timeout', () => {
  console.log('HEALTH CHECK TIMEOUT');
  request.destroy();
  process.exit(1);
});

request.end();