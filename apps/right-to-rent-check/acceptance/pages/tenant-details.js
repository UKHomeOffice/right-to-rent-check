/* eslint implicit-dependencies/no-implicit: [2, {dev:true}] */

'use strict';

let I;

module.exports = {

  _init() {
    I = require('so-acceptance/steps')();
  },

  url: 'tenant-details',
  backlink: '#step a',
  fields: {
    date: '#tenant-dob-group',
    day: '#tenant-dob-day',
    month: '#tenant-dob-month',
    year: '#tenant-dob-year',
    name: '#tenant-name',
    country: '#tenant-country'
  },
  content: {
    'future-date': {
      day: '1',
      month: '1',
      year: '2050'
    },
    'invalid-date': {
      day: 'd',
      month: 'm',
      year: 'y'
    },
    'underage-date': {
      day: '1',
      month: '1',
      year: (new Date()).getFullYear().toString()
    },
    'valid-date': {
      day: '1',
      month: '1',
      year: '1990'
    }
  },

  enterDate(type) {
    ['day', 'month', 'year'].forEach(part => {
      I.fillField(this.fields[part], this.content[`${type}-date`][part]);
    });
  }
};
