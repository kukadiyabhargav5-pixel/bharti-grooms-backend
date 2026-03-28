const speakeasy = require('speakeasy');
const secret = 'F56U46RMLBDWCTCXHNSE4Y3XF5DFWQDNMNASU4ZRMJUEGV3QMR5Q';

const checkCode1 = '694204';
const checkCode2 = '274460';

console.log('--- Scanning surrounding time steps ---');
for (let i = -100; i <= 100; i++) {
  const token = speakeasy.totp({
    secret: secret,
    encoding: 'base32',
    time: (Date.now() / 1000) + (i * 30)
  });
  if (token === checkCode1) {
    console.log(`MATCH FOUND for 694204! at step ${i} (${i * 30} seconds)`);
  }
  if (token === checkCode2) {
    console.log(`MATCH FOUND for 274460! at step ${i} (${i * 30} seconds)`);
  }
}
console.log('--- Scan completed ---');
