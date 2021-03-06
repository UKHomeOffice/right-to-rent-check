/* eslint implicit-dependencies/no-implicit: [2, {dev:true}] */

'use strict';

let I;

module.exports = {
  _init() {
    I = require('so-acceptance/steps')();
  },

  url: 'tenant-current-address',

  elements: {
    manualEntry: 'a[href="?step=manual"]',
    address: '#tenant-current-address'
  },

  content: {
    address: 'An address'
  },

  completeAddress() {
    I.click(this.elements.manualEntry);
    I.fillField(this.elements.address, this.content.address);
    I.submitForm();
  }
};
