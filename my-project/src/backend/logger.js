const fs = require('fs');
const path = require('path');

module.exports = {
  logError: (msg, err) => {
    const logPath = path.join(__dirname, '../../debug-error.log');
    const time = new Date().toISOString();
    const errorMessage = typeof err === 'object' ? err.message || JSON.stringify(err) : err;
    fs.appendFileSync(logPath, `[${time}] ${msg}: ${errorMessage}\n`);
  }
};
