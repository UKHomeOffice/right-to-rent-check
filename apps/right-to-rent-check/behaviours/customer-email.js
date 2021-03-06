'use strict';

const Emailer = require('hof-behaviour-emailer');
const path = require('path');
const moment = require('moment');

const config = require('../../../config');

const obfuscate = str => str.replace(/./g, '*');

const getDataRows = (model, translate) => {
  const label = key => translate(`email.customer.fields.${key}.label`);
  const isAgent = model.representative === 'agent';
  return [
    {
      table: [
        { label: label('submitted'), value: moment().format(config.dateTimeFormat) },
        { label: label('rental-property-address'), value: model['rental-property-address'] },
        { label: label('tenant-current-address'), value: model['tenant-current-address'] }
      ]
    },
    {
      title: 'Tenant details',
      table: model.tenants.reduce((fields, tenant, i) => fields.concat([
        { linebreak: i > 0 },
        { label: label('tenant-name'), value: tenant['tenant-name'] },
        { label: label('tenant-dob'), value: moment(tenant['tenant-dob']).format(config.dateFormat) },
        { label: label('tenant-country'), value: tenant['tenant-country'] },
        { label: label('tenant-reference-number'), value: obfuscate(tenant['tenant-reference-number']) },
        { label: label('tenant-passport-number'), value: obfuscate(tenant['tenant-passport-number']) },
        { label: label('tenant-brp-number'), value: obfuscate(tenant['tenant-brp-number']) },
        { label: label('tenant-recorded-delivery-number'), value: obfuscate(tenant['tenant-recorded-delivery-number']) }
      ]), [])
    },
    isAgent && {
      title: 'Agent details',
      table: [
        { label: label('agent-company'), value: model['agent-company'] },
        { label: label('agent-name'), value: model['agent-name'] },
        { label: label('agent-email-address'), value: model['agent-email-address'] },
        { label: label('agent-phone-number'), value: model['agent-phone-number'] },
        { label: label('agent-address'), value: model['agent-address'] }
      ]
    },
    {
      title: 'Landlord details',
      table: [
        { label: label('landlord-name'), value: model['landlord-name'] },
        !isAgent && { label: label('landlord-email-address'), value: model['landlord-email-address'] },
        !isAgent && { label: label('landlord-phone-number'), value: model['landlord-phone-number'] },
        !isAgent && { label: label('landlord-company'), value: model['landlord-company'] },
        { label: label('landlord-address'), value: model['landlord-address'] }
      ].filter(Boolean)
    },

  ].filter(Boolean);
};

module.exports = settings => {
  if (settings.transport !== 'stub' && !settings.from && !settings.replyTo) {
    // eslint-disable-next-line no-console
    console.warn('WARNING: Email `from` address must be provided. Falling back to stub email transport.');
  }
  return Emailer(Object.assign({}, settings, {
    transport: settings.from ? settings.transport : 'stub',
    recipient: model => {
      return model.representative === 'agent' ? model['agent-email-address'] : model['landlord-email-address'];
    },
    subject: (model, translate) => translate('email.customer.subject'),
    template: path.resolve(__dirname, '../emails/customer.html'),
    parse: (model, translate) => Object.assign(model, { data: getDataRows(model, translate) })
  }));
};
