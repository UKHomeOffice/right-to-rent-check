'use strict';

const fs = require('fs');
const path = require('path');

const mix = require('mixwith').mix;

const PDFModel = require('../models/pdf');
const UploadModel = require('../models/upload');

const summaryData = require('./summary-sections');

module.exports = superclass => class extends mix(superclass).with(summaryData) {

  process(req, res, next) {
    this.renderHTML(req, res)
      .then(html => {
        req.log('debug', 'Creating PDF document');
        return this.createPDF(html);
      })
      .then(pdfBuffer => {
        req.log('debug', 'Created PDF document. Uploading.');
        return this.uploadPdf({
          name: 'application_form.pdf',
          data: pdfBuffer,
          mimetype: 'application/pdf'
        });
      })
      .then(result => {
        req.log('debug', 'Saved PDF document to S3');
        req.form.values['pdf-upload'] = result.url;
      })
      .then(() => {
        super.process(req, res, next);
      }, next)
      .catch((err) => {
        next(err);
      });
  }

  renderHTML(req, res) {
    return this.readCss()
      .then(css => {
        return new Promise((resolve, reject) => {
          const locals = Object.assign({}, this.locals(req, res), {
            title: 'Request for a Home Office right to rent check has been received',
            values: req.sessionModel.toJSON(),
            css
          });
          locals.rows = locals.rows.filter(row => {
            if (req.sessionModel.get('representative') === 'landlord') {
              return !row.section.id.match(/^agent/);
            } else if (req.sessionModel.get('representative') === 'agent') {
              return !row.section.id.match(/^landlord/);
            }
            return true;
          });
          res.render('pdf.html', locals, (err, html) => {
            if (err) {
              return reject(err);
            }
            resolve(html);
          });
        });
      });
  }

  uploadPdf(file) {
    const model = new UploadModel();
    model.set(file);
    return model.save();
  }

  createPDF(template) {
    const model = new PDFModel();
    model.set({template});
    return model.save();
  }

  readCss() {
    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(__dirname, '../../../public/css/app.css'), (err, data) => {
        return err ? reject(err) : resolve(data);
      });
    });
  }

};
