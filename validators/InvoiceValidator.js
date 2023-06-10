var Validator = require('./Validator');

class InvoiceValidator extends Validator {
  /**
   * Validation rules.
   *
   * @param  string type
   * @param  array data
   * @return Object
   */
  getRules(type, data = {}) {
    let rules = {};

    switch (type) {
      case 'mark-paid-invoice':
        rules = {
          uuid: 'required|exist:Invoice,uuid',
          amount: 'required|numeric',
        };
        break;
    }

    return rules;
  }

  getMessages(type) {
    let messages = {};
    switch (type) {
    }

    return messages;
  }
}

module.exports = InvoiceValidator;
