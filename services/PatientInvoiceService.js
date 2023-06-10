const {
    InvoiceRepository,
    HospitalRepository,
    AppointmentRepository,
  } = require('../repositories');
  const HospitalValidator = require('../validators/HospitalValidator');
  const InvoiceValidator = require('../validators/InvoiceValidator');
  const GenericError = require('../errors/GenericError');
  const { Hospital } = require('../models');
  
  class PatientInvoiceService {
    constructor(req) {
      this.invoiceRepo = new InvoiceRepository(req);
      this.hospitalRepo = new HospitalRepository(req);
      this.hosptialValidator = new HospitalValidator();
      this.invoiceValidator = new InvoiceValidator();
    }
  
    async mailInvoicetoAdmin(inputs) {
      const uuid = App.lodash.get(inputs, 'uuid');
      const invoice = await this.invoiceRepo.getFor(
        {
          uuid,
        },
        false,
        {
          include: [
            {
              model: Hospital,
              as: 'invoice_hospital',
            },
          ],
        }
      );
      return invoice;
    }
  
    async getInvoiceLists(inputs) {
      return await this.invoiceRepo.search(inputs, true);
    }
  
    async getHospitalInovices(inputs) {
      await this.hosptialValidator.validate(inputs, 'hospital-exists');
      const hospital = await this.hospitalRepo.getBy({
        uuid: App.lodash.get(inputs, 'uuid'),
      });
  
      let unBilledInvoice = await this.invoiceRepo.search(
        App.lodash.assign(inputs, {
          hospital_id: hospital.getData('id'),
          status: App.helpers.config('settings.invoiceStatus.pending.value'),
        }),
        false
      );
  
      let billedInvoice = await this.invoiceRepo.search(
        App.lodash.assign(inputs, {
          hospital_id: hospital.getData('id'),
          status: App.helpers.config('settings.invoiceStatus.paid.value'),
        }),
        true
      );
  
      return {
        unBilledInvoice,
        billedInvoice,
      };
    }
  
    async markInvoicePaid(inputs) {
      await this.invoiceValidator.validate(inputs, 'mark-paid-invoice');
      const invoice = await this.invoiceRepo.getBy({
        uuid: App.lodash.get(inputs, 'uuid'),
      });
  
      if (
        App.lodash.get(invoice, 'status') ===
        App.helpers.config('settings.invoiceStatus.paid.value')
      ) {
        throw new GenericError(
          App.helpers.config('messages.errorMessages.invoice.alreadyPaid')
        );
      }
  
      await this.invoiceRepo.update(
        {
          status: App.helpers.config('settings.invoiceStatus.paid.value'),
          paid_date: App.moment().format('YYYY-MM-DD'),
          payment_reference_id: App.lodash.get(inputs, 'payment_reference_id'),
          amount: App.lodash.get(inputs, 'amount'),
        },
        {
          where: {
            id: invoice.getData('id'),
          },
        }
      );
      return;
    }
  }
  
  module.exports = PatientInvoiceService;
  