const BaseTransformer = require('./BaseTransformer');
const { Invoice } = require('../../../models');

class InvoiceTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = Invoice;
  }
  async transform(invoice) {
    invoice = await invoice;

    let returnVal = {
      id: App.lodash.get(invoice, 'uuid'),
      invoice_number: App.lodash.get(invoice, 'invoice_number'),
      month: App.lodash.get(invoice, 'month'),
      month_formatted: App.moment(App.lodash.get(invoice, 'month'), 'M').format(
        'MMMM'
      ),
      year: App.lodash.get(invoice, 'year'),
      status: App.lodash.get(invoice, 'status'),
      invoice_number: App.lodash.get(invoice, 'invoice_number'),
      status_obj: App.lodash.find(App.helpers.config('settings.'), [
        'value',
        App.lodash.get(invoice, 'status'),
      ]),
      amount: App.lodash.get(invoice, 'amount'),
      paid_date: App.lodash.get(invoice, 'paid_date'),
      paid_date_formatted: App.lodash.get(invoice, 'paid_date')
        ? App.moment(App.lodash.get(invoice, 'paid_date'), 'YYYY-MM-DD').format(
            'do,mm yy'
          )
        : null,
      units: App.lodash.get(invoice, 'units'),
      unit_type: App.lodash.get(invoice, 'unit_type'),
      unit_amount: App.lodash.get(invoice, 'unit_amount'),
    };

    if ('invoice_hospital' in invoice) {
      returnVal['hospital'] = await this.getHospitalDetails(
        invoice['invoice_hospital']
      );
    }
    return returnVal;
  }

  async getHospitalDetails(hospital) {
    let transformer = require('./HospitalTransformer');
    return await new transformer(this.req, hospital, {}).init();
  }
}

module.exports = InvoiceTransformer;
