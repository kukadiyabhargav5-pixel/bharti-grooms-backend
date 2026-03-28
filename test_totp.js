const speakeasy = require('speakeasy');

const secret = 'F56U46RMLBDWCTCXHNSE4Y3XF5DFWQDNMNASU4ZRMJUEGV3QMR5Q';
const token = speakeasy.totp({
  secret: secret,
  encoding: 'base32'
});

console.log('Current expected token:', token);

const verified = speakeasy.totp.verify({
  secret: secret,
  encoding: 'base32',
  token: token
});

console.log('Verified self:', verified);
