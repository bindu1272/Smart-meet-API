var Validator = require('./Validator');

class ScreenQuestionsValidator extends Validator {
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
      case 'create':
        rules = {
          question: 'required',
        };
        break;
      case 'get' :
        rules = {
          uuid: 'required|exist:ScreenQuestions,uuid',
        };
      case 'delete':
        rules = {
          uuid: 'required|exist:ScreenQuestions,uuid'
        }
        break;
      case 'update-question':
        rules = {
          uuid: 'required|exist:ScreenQuestions,uuid'
        }
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

module.exports = ScreenQuestionsValidator;
