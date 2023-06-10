const BaseTransformer = require('./BaseTransformer');
const { DoctorLeave } = require('../../../models');

class DoctorLeaveTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = DoctorLeave;
  }

  async transform(doctorLeave) {
    doctorLeave = await doctorLeave;
    let returnVal = {
      id: App.lodash.get(doctorLeave, 'uuid'),
      date: App.lodash.get(doctorLeave, 'date'),
      whole_day: App.lodash.get(doctorLeave, 'whole_day'),
      leaveHours: App.lodash.map(
        App.lodash.get(doctorLeave, 'leave_hours'),
        (l) => {
          return {
            from_time: l.getData('from_time'),
            to_time: l.getData('to_time'),
          };
        }
      ),
    };
    return returnVal;
  }
}

module.exports = DoctorLeaveTransformer;
