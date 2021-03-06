'use strict';
/* eslint no-process-env: 0 */
/* eslint implicit-dependencies/no-implicit: [2, { dev: true }] */

const path = require('path');

const pagesPath = page => path.resolve(__dirname,
  `./apps/right-to-rent-check/acceptance/pages/${page}`);

module.exports = require('so-acceptance').extend({
  helpers: {
    WebDriverIO: {
      host: 'localhost',
      port: 4444,
      path: '/wd/hub',
      url: process.env.TEST_URL || 'http://localhost:8080',
      browser: 'chrome',
      desiredCapabilities: {
        chromeOptions: { args: ['headless', 'disable-gpu'] }
      }
    }
  },
  name: 'right-to-rent-check',
  tests: './apps/**/acceptance/features/**/*.js',
  include: {
    eligibilityCheckPage: pagesPath('eligibility-check.js'),
    documentCheckPage: pagesPath('documents-check.js'),
    documentCheckYourselfPage: pagesPath('documents-check-yourself.js'),
    checkNotNeededUkPage: pagesPath('check-not-needed-uk.js'),
    rentalPropertyLocationPage: pagesPath('rental-property-location.js'),
    checkNotNeededLocationPage: pagesPath('check-not-needed-location.js'),
    tenantInUkPage: pagesPath('tenant-in-uk.js'),
    checkConfirmedPage: pagesPath('check-confirmed.js'),
    startPage: pagesPath('start.js'),
    checkNotNeededDatePage: pagesPath('check-not-needed-date.js'),
    personInPropertyPage: pagesPath('person-in-property.js'),
    personLocationPage: pagesPath('person-location.js'),
    tenancyStartPage: pagesPath('tenancy-start-date.js'),
    agentDetailsPage: pagesPath('agent-details.js'),
    agentAddressPage: pagesPath('agent-address.js'),
    landlordNamePage: pagesPath('landlord-name.js'),
    tenantCurrentAddressPage: pagesPath('tenant-current-address.js'),
    tenantDetailsPage: pagesPath('tenant-details.js'),
    tenantAdditionalDetailsPage: pagesPath('tenant-additional-details.js'),
    requestAnotherTenantPage: pagesPath('request-another-tenant.js'),
    propertyAddressPage: pagesPath('property-address.js'),
    landlordAgentPage: pagesPath('landlord-or-agent.js'),
    landlordAddressPage: pagesPath('landlord-address.js'),
    landlordDetailsPage: pagesPath('landlord-details.js'),
    confirmPage: pagesPath('confirm.js'),
    declarationPage: pagesPath('declaration.js'),
    confirmationPage: pagesPath('confirmation.js')
  }
});
