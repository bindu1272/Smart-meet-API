module.exports = {
  doctorSlots: (fromTime, toTime, slotDiff, appointments, leave = null) => {
    const startTime = App.moment(fromTime, 'hh:mm');
    const endTime = App.moment(toTime, 'hh:mm');
    let slotsArr = [];

    if (App.lodash.get(leave, 'whole_day')) {
      return [];
    }

    let slot =
      parseInt(startTime.format('HH')) * 12 +
      parseInt(startTime.format('mm')) / 5;

    let lastSlot =
      parseInt(endTime.format('HH')) * 12 + parseInt(endTime.format('mm')) / 5;

    while (slot < lastSlot) {
      upperlimit = slot + slotDiff / 5;
      if (upperlimit > lastSlot) {
        break;
      }
      let bookedSlot = App.lodash.filter(
        appointments,
        (val) =>
          App.lodash.get(val, 'slot') >= slot &&
          App.lodash.get(val, 'slot') < upperlimit
      );

      if (bookedSlot.length > 0) {
        let maxBookedSlot = App.lodash.maxBy(bookedSlot, 'slot');
        bookedSlot = App.lodash.map(bookedSlot, (bs) => {
          return {
            slot: App.lodash.get(bs, 'slot'),
            type: App.lodash.get(bs, 'type'),
            booked: true,
          };
        });
        slotsArr = [...slotsArr, ...bookedSlot];
        slot =
          App.lodash.get(maxBookedSlot, 'slot') +
          App.lodash.get(maxBookedSlot, 'type') / 5;
      } else {
        slotsArr.push({ type: slotDiff, slot: slot, booked: false });
        slot = slot + slotDiff / 5;
      }
    }

    if (leave) {
      App.lodash.map(App.lodash.get(leave, 'leave_hours', []), (lh) => {
        let fromTime = App.moment(App.lodash.get(lh, 'from_time'), 'hh:mm');
        let toTime = App.moment(App.lodash.get(lh, 'to_time'), 'hh:mm');
        let startSlot =
          parseInt(fromTime.format('HH')) * 12 +
          parseInt(fromTime.format('mm')) / 5;

        let endSlot =
          parseInt(toTime.format('HH')) * 12 +
          parseInt(toTime.format('mm')) / 5;

        App.lodash.remove(
          slotsArr,
          (slot) =>
            startSlot <= App.lodash.get(slot, 'slot') &&
            App.lodash.get(slot, 'slot') < endSlot &&
            !App.lodash.get(slot, 'booked')
        );
      });
    }

    return slotsArr;
  },
};
