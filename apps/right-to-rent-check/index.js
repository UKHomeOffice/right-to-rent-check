'use strict';

const AddressLookup = require('hof-behaviour-address-lookup');

module.exports = {
  name: 'right-to-rent-check',
  params: '/:action?/:id?',
  steps: {
    '/property': {
      fields: ['living-status'],
      next: '/tenancy-start',
      forks: [{
        target: '/current-property-address',
        condition: {
          field: 'living-status',
          value: 'no'
        }
      }]
    },
    '/tenancy-start': {
      fields: ['tenancy-start'],
      next: '/tenant-details'
    },
    '/current-property-address': {
      behaviours: AddressLookup({
        addressKey: 'current-address'
      }),
      next: '/tenant-details'
    },
    '/tenant-details': {
      fields: [
        'tenant-name',
        'tenant-dob',
        'tenant-country'
      ],
      next: '/tenant-additional-details'
    },
    '/tenant-additional-details': {
      next: '/tenant-another'
    },
    '/tenant-another': {
      next: '/landlord-agent'
    },
    '/landlord-agent': {
      next: '/landlord-details'
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
      next: '/landlord-name'
    },
    '/landlord-name': {
      fields: [
        'landlord-name-agent'
      ],
      next: '/landlord-address'
    },
    '/landlord-address': {
      next: '/confirm'
    },
    '/confirm': {
      next: '/complete'
    },
    '/complete': {}
  }
};
