const ejs = require('ejs');
const path = require('path');
var fs = require('fs');
const pdf = require('html-pdf');
const Mail = require('../../../../utilities/mail/Mail');
const InvoiceServices = require('../../../../services/InvoiceServices');
const BaseController = require('./BaseController');
const { InvoiceTransformer } = require('../../../../transformers/Response/v1');

module.exports = {
  getInovices: async (req, res) => {
    let result = await new InvoiceServices(req).getInvoiceLists(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );

    const transformedInvoices =
      await BaseController.getTransformedDataWithPagination(
        req,
        result,
        InvoiceTransformer
      );

    res.success(transformedInvoices);
  },

  getHospitalInovices: async (req, res) => {
    const { unBilledInvoice, billedInvoice } = await new InvoiceServices(
      req
    ).getHospitalInovices(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );

    const transformedUnbilledInvoices = await BaseController.getTransformedData(
      req,
      unBilledInvoice,
      InvoiceTransformer
    );

    const transformedBilledInvoices =
      await BaseController.getTransformedDataWithPagination(
        req,
        billedInvoice,
        InvoiceTransformer
      );

    res.success({
      unbilledInvoice: transformedUnbilledInvoices,
      billedInvoice: transformedBilledInvoices,
    });
  },

  markInvoicePaid: async (req, res) => {
    const result = await new InvoiceServices(req).markInvoicePaid(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );

    res.noContent();
  },

  mailInvoice: async (req, res) => {
    const template = path.resolve(App.paths.views, 'invoice.ejs');
    let invoice = await new InvoiceServices().mailInvoicetoAdmin(req.params);
    invoice = JSON.parse(JSON.stringify(App.lodash.get(invoice, 'dataValues')));
    console.log(
      App.lodash.get(
        App.lodash.find(App.helpers.config('settings.billingMethods'), [
          'value',
          App.lodash.get(invoice, 'unit_type'),
        ]),
        'name'
      )
    );
    ejs.renderFile(
      template,
      {
        data: invoice,
        date: App.moment(
          `${App.lodash.get(invoice, 'month')}-${App.lodash.get(
            invoice,
            'year'
          )}`,
          'MM-YYYY'
        ).format('MMMM-YYYY'),
        unit_type: App.lodash.get(
          App.lodash.find(App.helpers.config('settings.billingMethods'), [
            'value',
            App.lodash.get(invoice, 'unit_type'),
          ]),
          'name'
        ),
      },
      {},
      (err, str) => {
        const filePath = `uploads/temp/${App.lodash.get(
          req,
          'params.uuid'
        )}.pdf`;

        pdf.create(str).toBuffer(function (err, buffer) {
       
          new Mail().send({
            to: 'jio@mailinator.com',
            from: process.env.NO_REPLY_EMAIL,
            subject: `SmartMeet Invoice -${App.moment(
              `${App.lodash.get(invoice, 'month')}-${App.lodash.get(
                invoice,
                'year'
              )}`,
              'MM-YYYY'
            ).format('MMMM-YYYY')}`,
            attachments: [
              {
                filename: `invoice.pdf`,
                content: buffer.toString('base64'),
                type: 'application/pdf',
                disposition: 'attachment',
              },
            ],
          });
        });
      }
    );
    res.noContent();
  },
};
