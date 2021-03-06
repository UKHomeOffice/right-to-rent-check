/* eslint implicit-dependencies/no-implicit: [2, {dev:true}] */

'use strict';

let I;

module.exports = {
  _init() {
    I = require('so-acceptance/steps.js')();
  },

  url: 'person-in-property',
  backlink: '#step a',
  fields: {
    yes: '#living-status-yes',
    no: '#living-status-no'
  },
  livingStatusGroup: '#living-status-group',

  selectYesAndSubmit() {
    I.click(this.fields.yes);
    I.submitForm();
  },

  selectNoAndSubmit() {
    I.click(this.fields.no);
    I.submitForm();
  }
};
