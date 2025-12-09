const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/health',
  method: 'GET',
  timeout: 5000,
  headers: {
    'User-Agent': 'Docker-Health-Check/1.0'
  }
};

console.log(`Performing health check on ${options.hostname}:${options.port}${options.path}`);

const request = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Health check response - Status: ${res.statusCode}, Body: ${data.trim()}`);
    
    if (res.statusCode === 200) {
      console.log('✅ Backend is healthy');
      process.exit(0);
    } else {
      console.log(`❌ Backend returned status: ${res.statusCode}`);
      process.exit(1);
    }
  });
});

request.on('error', (err) => {
  console.error('❌ Health check error:', err.message);
  process.exit(1);
});

request.on('timeout', () => {
  console.error('❌ Health check timeout after 5 seconds');
  request.destroy();
  process.exit(1);
});

// Set timeout
request.setTimeout(5000);

request.end();
