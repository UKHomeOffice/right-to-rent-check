'use strict';
const dateComponent = require('hof-component-date');

module.exports = {
  'living-status': {
    mixin: 'radio-group',
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    },
    options: [
      'yes',
      'no'
    ]
  },
  'tenancy-start': dateComponent('tenancy-start', {
    validate: ['required', 'date', 'before'],
    legend: {
      className: 'visuallyhidden'
    }
  }),
  'tenant-name': {
    mixin: 'input-text',
    validate: 'required'
  },
  'tenant-country': {
    mixin: 'select',
    validate: 'required',
    className: ['typeahead', 'js-hidden'],
    options: [''].concat(require('homeoffice-countries').allCountries)
  },
  'tenant-dob': dateComponent('tenant-dob', {
    validate: ['required', 'date', 'before']
  }),
  'agent-company': {
    mixin: 'input-text',
    validate: 'required'
  },
  'agent-name': {
    mixin: 'input-text',
    validate: 'required'
  },
  'agent-email-address': {
    mixin: 'input-text',
    validate: ['required', 'email']
  },
  'agent-phone-number': {
    mixin: 'input-text',
    validate: 'required'
  }
};
