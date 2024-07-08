const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    "experimentalSessionandOrigin": true,
    "trashAssetsBeforeRuns": true,
    
    // Uncomment localhost and comment out heroku when testing on computer,
    // uncomment heroku and comment out localhost when testing on heroku

    "baseUrl": "https://medical-mayhem-c0832c3f548e.herokuapp.com",
    // "baseUrl": "http://localhost:3000",
  },
});