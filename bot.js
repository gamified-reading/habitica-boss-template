// Require the habitica-boss package from npm
const {Bot, ChallengeSet} = require('habitica-boss');

// Initialize the dashboard variable
let dashboard = null;

//Get configuration
const config = require('./config.json');

// Create the list of challenges
const challenges = new ChallengeSet(require('./challenges.json').list);

// Get authentication information
let auth = require('./auth.json');
auth.bot.platform = auth.owner.platform = auth.owner.id + '-' + config.bot.name;

// Create the bot
const bot = new Bot(challenges, auth.bot);

// Schedule daily updates
async function update() {
  // Update the member stats
  await bot.updateMembers().then(() => {
    console.info('Member stats updated.');
    // Calculate new stats based on the updated values
    bot.updateStats();
  });
}

//Send a message with the compiled report in your guild
async function sendReport() {
  console.log('Sending a report to your guild...');
  bot.sendReport(config.guild.id, config.report.append);
}

// Set up dashboard
function setUpDashboard() {
  // Templates
  dashboard.templates('pug', './dashboard/templates/');

  // Static content
  dashboard.static('./dashboard/static/');

  dashboard.get('/', async (request, response) => {
    response.render('homepage.pug', {challenges});
  });
}

// Run an update now to get some initial stats
console.info('Running an initial update...');
update().then(() => {
  // If you set in config to send the update onStart, send it
  if (config.report.onStart) sendReport();

  // Start the dashboard
  dashboard = require('./dashboard/app.js');

  // Set up dashboard
  setUpDashboard();
});

// Schedule a daily update that sends to your guild at midnight each day
bot.scheduleTask(() => {
  console.log('Updating stats...');
  update().then(sendReport);
});

// Do an extra update every three hours for the dashboard
bot.scheduleTask(() => {
  update();
}, `0 3,6,9,12,15,18,21 * * *`);