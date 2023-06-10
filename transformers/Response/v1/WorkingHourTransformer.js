const BaseTransformer = require('./BaseTransformer');
const { WorkingHour } = require('../../../models');

class WorkingHourTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = WorkingHour;
  }

  async transform(workingHour) {
    workingHour = await workingHour;
    let returnVal = {
      id: App.lodash.get(workingHour, 'uuid'),
      day: App.lodash.get(workingHour, 'day'),
      from_time: App.lodash.get(workingHour, 'from_time'),
      to_time: App.lodash.get(workingHour, 'to_time'),
    };
    return returnVal;
  }
}

module.exports = WorkingHourTransformer;
