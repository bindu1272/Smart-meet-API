const InvoiceController = require('../../app/http/controllers/api/v1/InvoiceController');
const superAdminMiddleware = ['auth.jwt', 'hasRole:SuperAdmin'];
const adminMiddleware = ['auth.jwt', 'hasRole:Admin'];
const invoiceRoute = `invoices`;

module.exports = {
  [`GET ${invoiceRoute}`]: {
    action: InvoiceController.getInovices,
    name: 'api.InvoiceController.getInovices',
    middlewares: [...superAdminMiddleware],
  },

  [`GET hospitals/:uuid/${invoiceRoute}`]: {
    action: InvoiceController.getHospitalInovices,
    name: 'api.InvoiceController.getHospitalInovices',
    middlewares: [...adminMiddleware],
  },

  [`PUT ${invoiceRoute}/:uuid/paid`]: {
    action: InvoiceController.markInvoicePaid,
    name: 'api.InvoiceController.markInvoicePaid',
    middlewares: [...superAdminMiddleware],
  },

  [`POST ${invoiceRoute}/:uuid/mail`]: {
    action: InvoiceController.mailInvoice,
    name: 'api.InvoiceController.mailInvoice',
    middlewares: [...superAdminMiddleware],
  },
};
