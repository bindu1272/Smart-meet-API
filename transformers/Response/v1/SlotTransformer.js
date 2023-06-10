const BaseTransformer = require('./BaseTransformer');
// const { Otp } = require('../../../models');

class SlotTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
  }

  async transform(slot) {
    slot = await slot;
    let returnVal = {
      id: App.lodash.get(slot, 'slot'),
      type: App.lodash.get(slot, 'type'),
      booked: App.lodash.get(slot, 'booked'),
      slot_start: App.moment()
        .startOf('day')
        .add(App.lodash.get(slot, 'slot') * 5, 'minutes')
        .format('HH:mm'),
      slot_end: App.moment()
        .startOf('day')
        .add(
          App.lodash.get(slot, 'slot') * 5 + App.lodash.get(slot, 'type'),
          'minutes'
        )
        .format('HH:mm'),

      slot_time: `${App.moment()
        .startOf('day')
        .add(App.lodash.get(slot, 'slot') * 5, 'minutes')
        .format('HH:mm')}- ${App.moment()
        .startOf('day')
        .add(
          App.lodash.get(slot, 'slot') * 5 + App.lodash.get(slot, 'type'),
          'minutes'
        )
        .format('HH:mm')}`,
    };
    return returnVal;
  }
}

module.exports = SlotTransformer;
