'use strict';

const _ = require('lodash');
const AddressLookup = require('hof-behaviour-address-lookup');
const checkPilotPostcodeAndDate = require('./behaviours/tenancy-start-postcode-check');
const ageRestriction = require('./behaviours/age-restriction');
const tenants = require('./behaviours/tenants')([
  'tenant-name',
  'tenant-dob',
  'tenant-country',
  'tenant-reference-number',
  'tenant-passport-number',
  'tenant-brp-number',
  'tenant-recorded-delivery-number'
]);
const getDeclarer = require('./behaviours/get-declarer');
const rentalQuestions = require('./behaviours/rental-questions');
const config = require('../../config');

module.exports = {
  name: 'right-to-rent-check',
  params: '/:action?/:id?',
  behaviours: [require('./behaviours/filter-fields')],
  steps: {
    '/eligibility-check': {
      next: '/documents-check'
    },
    '/documents-check': {
      fields: ['documents-check'],
      next: '/rental-property-location',
      forks: [{
        target: '/documents-check-yourself',
        condition: {
          field: 'documents-check',
          value: 'yes'
        }
      }],
    },
    '/documents-check-yourself': {},
    '/rental-property-location': {
      next: '/check-not-needed-location',
      fields: ['rental-property-location'],
      forks: [{
        target: '/rental-property-address',
        condition: {
          field: 'rental-property-location',
          value: 'england'
        }
      }]
    },
    '/check-not-needed-location': {},
    '/rental-property-address': {
      behaviours: AddressLookup({
        required: true,
        addressKey: 'property-address',
        apiSettings: {
          hostname: config.postcode.hostname
        }
      }),
      next: '/person-in-property'
    },
    '/person-in-property': {
      fields: ['living-status'],
      next: '/tenancy-start-date',
      forks: [{
        target: '/tenant-in-uk',
        condition: {
          field: 'living-status',
          value: 'no'
        }
      }],
    },
    '/tenant-in-uk': {
      fields: ['tenant-in-uk'],
      next: '/current-property-address',
      forks: [{
        target: '/check-not-needed-uk',
        condition: {
          field: 'tenant-in-uk',
          value: 'no'
        }
      }],
    },
    '/check-not-needed-uk': {},
    '/tenancy-start-date': {
      behaviours: [checkPilotPostcodeAndDate],
      fields: ['tenancy-start'],
      next: '/check-confirmed'
    },
    '/check-confirmed': {
      next: '/start',
      behaviours: [rentalQuestions]
    },
    '/start': {
      next: '/tenant-details'
    },
    '/current-property-address': {
      behaviours: AddressLookup({
        addressKey: 'current-address',
        apiSettings: {
          hostname: config.postcode.hostname
        }
      }),
      next: '/check-confirmed'
    },
    '/tenant-details': {
      behaviours: [ageRestriction],
      fields: [
        'tenant-name',
        'tenant-dob',
        'tenant-country'
      ],
      next: '/tenant-additional-details',
      forks: [{
        target: '/request-another-tenant',
        condition: (req) => {
          return _.find(req.sessionModel.get('tenants'), {
            edit: true
          });
        }
      }]
    },
    '/tenant-additional-details': {
      fields: [
        'tenant-additional-details',
        'tenant-reference-number',
        'tenant-passport-number',
        'tenant-brp-number',
        'tenant-recorded-delivery-number'
      ],
      next: '/request-another-tenant'
    },
    '/request-another-tenant': {
      behaviours: [tenants],
      fields: [
        'tenant-add-another',
      ],
      next: '/landlord-agent',
      forks: [{
        target: '/tenant-details',
        condition: {
          field: 'tenant-add-another',
          value: 'yes'
        }
      }]
    },
    '/landlord-agent': {
      fields: [
        'representative'
      ],
      next: '/landlord-details',
      forks: [{
        target: '/agent-details',
        condition: {
          field: 'representative',
          value: 'agent'
        }
      }]
    },
    '/landlord-details': {
      fields: [
        'landlord-name',
        'landlord-company',
        'landlord-email-address',
        'landlord-phone-number'
      ],
      next: '/confirm'
    },
    '/agent-details': {
      fields: [
        'agent-company',
        'agent-name',
        'agent-email-address',
        'agent-phone-number'
      ],
      next: '/agent-address'
    },
    '/agent-address': {
      behaviours: AddressLookup({
        required: true,
        addressKey: 'agent-address',
        apiSettings: {
          hostname: config.postcode.hostname
        }
      }),
      next: '/landlord-name'
    },
    '/landlord-name': {
      fields: [
        'landlord-name-agent'
      ],
      next: '/landlord-address'
    },
    '/landlord-address': {
       behaviours: AddressLookup({
        required: true,
        addressKey: 'landlord-address',
        apiSettings: {
          hostname: config.postcode.hostname
        }
      }),
      next: '/confirm'
    },
    '/confirm': {
      next: '/declaration'
    },
    '/declaration': {
      behaviours: [getDeclarer],
      next: '/confirmation'
    },
    '/confirmation': {},
    '/check-not-needed-date': {
      next: '/start'
    },
    '/privacy-policy': {
    },
  }
};
