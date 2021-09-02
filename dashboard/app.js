// Create a new Vocado server
const Vocado = require('vocado');
const dashboard = new Vocado();

// Import config
const config = require('../config.json');

// Listen on the port set in config
dashboard.listen(config.dashboard.port, () => {
  console.info(`Dashboard is being served at http://localhost:${config.dashboard.port}/`);
});

module.exports = dashboard;
