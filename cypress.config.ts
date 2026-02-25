const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.js",
    experimentalCspAllowList: true,
    supportFile: false, // Cypress nebude hľadať e2e.js
    setupNodeEvents(on, config) {
      return config;
    },
  },
});
