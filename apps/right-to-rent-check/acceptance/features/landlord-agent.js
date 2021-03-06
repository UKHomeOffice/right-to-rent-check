'use strict';

Feature('landlord agent step');

Before((
  I,
  landlordAgentPage
) => {
  I.amOnPage('/');
  I.completeToStep(landlordAgentPage.url, {
    'documents-check': 'no',
    'rental-property-location': 'england',
    'rental-property-address-postcode': 'CR0 2EU',
    'living-status': 'no',
    'tenant-in-uk': 'yes',
    'tenant-add-another': 'no'
  });
});

Scenario('I select Landlord, click ‘Continue’ & go to /landlord-details step', (
  I,
  landlordAgentPage,
  landlordDetailsPage
) => {
  I.click(landlordAgentPage.fields.landlord);
  I.submitForm();
  I.seeInCurrentUrl(landlordDetailsPage.url);
});

Scenario('I select ‘Agent’, click ‘Continue’ I go to /agent-details step', (
  I,
  landlordAgentPage,
  agentDetailsPage
) => {
  I.click(landlordAgentPage.fields.agent);
  I.submitForm();
  I.seeInCurrentUrl(agentDetailsPage.url);
});

Scenario('I see errors when I submit form after leaving both buttons unselected', (
  I,
  landlordAgentPage
) => {
  I.submitForm();
  I.seeErrors([
    landlordAgentPage.representativeGroup
  ]);
});

Scenario('When editing the landlord name from the /confirm page I am returned to the correct step (bugfix)', (
  I
) => {
  // continue to confirm page
  I.completeToStep('/confirm', {
    representative: 'agent'
  });
  // edit landlord name
  I.click('#landlord-name-change');

  I.seeInCurrentUrl('/landlord-name');
  I.dontSeeElement('#landlord-company');
  I.dontSeeElement('#landlord-email-address');
  I.dontSeeElement('#landlord-phone-number');
});


