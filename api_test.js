const http = require('http');

const loginData = JSON.stringify({ username: "logistics_admin", password: "admin123" });

const req = http.request({
  hostname: 'localhost',
  port: 8081,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const json = JSON.parse(body);
    console.log("LOGIN SUCCESS! Token extracted.");
    
    if (json.token) {
      const getReq = http.request({
        hostname: 'localhost',
        port: 8081,
        path: '/api/logistics/shipments',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${json.token}`
        }
      }, (res2) => {
        let body2 = '';
        res2.on('data', d => body2 += d);
        res2.on('end', () => {
          console.log("SHIPMENTS RESPONSE:");
          console.log(JSON.stringify(JSON.parse(body2), null, 2));
        });
      });
      getReq.end();
    }
  });
});

req.write(loginData);
req.end();
