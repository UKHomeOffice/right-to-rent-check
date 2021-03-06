'use strict';

const steps = require('../../../');
const add = (n) => {
  return function () {
    if (n != 0) {
      n = n - 1
      return 'yes'
    }
    return 'no';
  }
};

Feature('Given from /confirm I click to edit tenant-name');

Before((
  I
) => {
  I.amOnPage('/');
  I.completeToStep('/confirm', {
    'documents-check': 'no',
    'rental-property-location': 'england',
    'rental-property-address-postcode': 'CR0 2EU',
    'living-status': 'no',
    'tenant-in-uk': 'yes',
    'tenant-current-address-postcode': 'CR0 2EU',
    'tenant-add-another': add(2),
    'representative': 'agent',
    'agent-company': 'abc corp',
    'agent-name': 'abc',
    'agent-email-address': 'abc@abc-corp.com',
    'agent-phone-number': '12345',
    'agent-address': 'CR0 2EU',
    'landlord-name': 'Johnny',
    'landlord-address-postcode': 'CR0 2EU'
  });
  I.click('#tenant-name-change');
  I.seeInCurrentUrl('tenant-details/edit#tenant-name');
});

Scenario('When I continue to /confirm without adding another tenant then I see the same tenants', (
  I
) => {
  I.click('#step a');
  I.seeInCurrentUrl('request-another-tenant/edit');
  I.checkOption('#tenant-add-another-no');
  I.click('input[type=\'submit\']');
  I.seeInCurrentUrl('/confirm');
  I.seeNumberOfElements('table[data-section=\'tenant-details\']', 1);
  I.seeNumberOfElements('tbody[data-group=\'tenants\']', 2);
  I.seeNumberOfElements('tr[data-id=\'tenant-name\']', 2);
  I.seeNumberOfElements('tr[data-id=\'tenant-dob\']', 2);
  I.seeNumberOfElements('tr[data-id=\'tenant-country\']', 2);
  I.seeNumberOfElements('tr[data-id=\'tenant-reference-number\']', 2);
  I.seeNumberOfElements('tr[data-id=\'tenant-passport-number\']', 2);
  I.seeNumberOfElements('tr[data-id=\'tenant-brp-number\']', 2);
  I.seeNumberOfElements('tr[data-id=\'tenant-recorded-delivery-number\']', 2);
});

Scenario('When I edit a tenant name and continue the new name appears on the confirm page', (
  I
) => {
  I.fillField('#tenant-name', 'Edited Tenant Name');
  I.click('input[type=\'submit\']');
  I.seeInCurrentUrl('/confirm');
  I.see('Edited Tenant Name', 'tr[data-id=\'tenant-name\']');
});
