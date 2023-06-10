const BaseTransformer = require('./BaseTransformer');
const { AppointmentNote } = require('../../../models');

class AppointmentNoteTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = AppointmentNote;
  }

  async transform(appointmentNote) {
    appointmentNote = await appointmentNote;

    let returnVal = {
      id: App.lodash.get(appointmentNote, 'uuid'),
      notes: App.lodash.get(appointmentNote, 'notes.notes'),
      attachments: await this.getAttachment(
        App.lodash.get(appointmentNote, 'notes.attachments')
      ),
    };

    if ('note_appointment' in appointmentNote) {
      returnVal['appointment'] = await this.getAppointment(
        appointmentNote['note_appointment']
      );
    }
    if (
      'note_updated_by' in appointmentNote &&
      appointmentNote['note_updated_by']
    ) {
      returnVal['note_updated_by'] = await this.getAppointmentUpdatedBy(
        appointmentNote['note_updated_by']
      );
    }

    return returnVal;
  }

  async getAttachment(attachObj) {
    let returnArr = App.lodash.map(attachObj, (obj) => {
      return {
        title: App.lodash.get(obj, 'title'),
        images: App.lodash.map(App.lodash.get(obj, 'images'), (im) => {
          return {
            uuid: im,
            image_url: App.helpers.getImageUrl(im),
          };
        }),
      };
    });
    return returnArr;
  }

  async getAppointmentUpdatedBy(user) {
    let transformer = require('./UserTransformer');
    return await new transformer(this.req, user, {}).init();
  }
  async getAppointment(appointment) {
    let transformer = require('./AppointmentTransformer');
    return await new transformer(this.req, appointment, {}).init();
  }
}

module.exports = AppointmentNoteTransformer;
