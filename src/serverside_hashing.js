const express = require('express')
const app = express()
const port = 3000
const path = require('path');


// Render Html File
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'templates/index.html'));
});
function generateSalt() {
  const crypto = require('crypto'); // require the crypto module

  // generate a random 16-byte salt
  const salt = crypto.randomBytes(16);

  // return the salt as a hexadecimal string
  return salt.toString('hex');
}
function hashPassword(password, salt) {
  const crypto = require('crypto');
  // create a hash object using the sha256 algorithm
  const hash = crypto.createHash('sha256');
  // update the hash object with the password and salt values
  hash.update(password + salt);
  // generate the hashed password + salt combination
  const hashedPassword = hash.digest('hex');
  // return the hashed password + salt combination
  return `${hashedPassword}`;
}
function login(hash, salt, entered_pass){
    const rehash = hashPassword(entered_pass, salt);
    if (rehash == hash) {
        return true;
    }
    return false;
}
app.listen(port, () => {
    const salt = generateSalt();
    const password = 'Password123'
    hashed_password = hashPassword(password, salt);
    if (login(hashed_password, salt, 'Password123')) {
        console.log('Login Success!');
    } else {
        console.log('Login Failure!');
    }
    
})