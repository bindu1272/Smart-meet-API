const ejs = require('ejs');
const path = require('path');
const pdf = require('html-pdf');
const BaseController = require('./BaseController');
const AppointmentService = require('../../../../services/AppointmentService');
const AppointmentNoteService = require('../../../../services/AppointmentNoteService');
const {
  SlotTransformer,
  OtpTransformer,
  AppointmentTransformer,
  AppointmentNoteTransformer,
} = require('../../../../transformers/Response/v1');
const Appointment = require('../../../../models/Appointment');

module.exports = {
  getDoctorsAppointments: async (req, res) => {
    const doctorSlots = await new AppointmentService(
      req
    ).getDoctorsAppointments(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );
    const transformeSlots = await BaseController.getTransformedData(
      req,
      doctorSlots,
      SlotTransformer
    );
    res.success(transformeSlots);
  },

  getDoctorMonthlyAvaialbility: async (req, res) => {
    const monthlyAvailablity = await new AppointmentService(
      req
    ).getDoctorsMonthlyAvailabilty(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );

    res.success(monthlyAvailablity);
  },

  createAppointment: async (req, res) => {
    const appointmentOtp = await new AppointmentService(req).createAppointment(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    const transformeData = await BaseController.getTransformedData(
      req,
      appointmentOtp,
      OtpTransformer
    );
    res.success(transformeData);
  },
  createEmergencyAppointment: async (req, res) => {
    const appointment = await new AppointmentService(req).createEmergencyAppointment(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.success(appointment);
  },

  cancelledAppointment: async (req, res) => {
    await new AppointmentService(req).patientCanceAppointment(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );

    res.noContent();
  },

  rescheduleAppointment: async (req, res) => {
    const appointmentOtp = await new AppointmentService(
      req
    ).rescheduleAppointment(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );

    res.noContent();
  },

  validateAppointment: async (req, res) => {
    const appointment = await new AppointmentService(req).validateAppointment(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },

  getAppointments: async (req, res) => {
    const appointments = await new AppointmentService(req).getAppointments(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );
    const transformeData =
      await BaseController.getTransformedDataWithPagination(
        req,
        appointments,
        AppointmentTransformer
      );
    res.success(transformeData);
  },

  getDoctorLineUp: async (req, res) => {
    const appointments = await new AppointmentService(req).getDoctorLineUp(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );
    const transformeData = await BaseController.getTransformedData(
      req,
      appointments,
      AppointmentTransformer
    );
    res.success(transformeData);
  },

  updateAppointment: async (req, res) => {
    await new AppointmentService(req).updateAppointment(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },

  addAppointmentNote: async (req, res) => {
    await new AppointmentNoteService(req).addAppointmentNote(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },

  updateAppointmentNote: async (req, res) => {
    await new AppointmentNoteService(req).updateAppointmentNote(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },

  getMedicalHistory: async (req, res) => {
    let medicalHistory = await new AppointmentNoteService(
      req
    ).getPatientMedicalHistory(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );
    const transformeData =
      await BaseController.getTransformedDataWithPagination(
        req,
        medicalHistory,
        AppointmentNoteTransformer
      );
    res.success(transformeData);
  },

  printMedicalHistory: async (req, res) => {
    let medicalHistory = await new AppointmentNoteService(
      req
    ).getMedicalHistory(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );

    const transformeData = await BaseController.getTransformedData(
      req,
      medicalHistory,
      AppointmentNoteTransformer
    );
    // return res.send(transformeData);
    const template = path.resolve(App.paths.views, 'medicalhistory.ejs');
    ejs.renderFile(
      template,
      {
        data: transformeData,
        getAddress: App.helpers.getAddress,
      },
      {},
      (err, str) => {
        pdf
          .create(str, {
            format: 'Letter',
            orientation: 'portrait',
            margin: '1cm',
            border: {
              top: '1cm',
              bottom: '1mm',
            },
            footer: {
              height: '28mm',
              contents: {
                last: `<div class="footer">
                  <div>Contact no: +91 9147105613</div>
                  <div>Mail id: maxhospital@gmail.com</div>
              </div>`, // fallback value
              },
            },
          })
          .toStream(function (err, stream) {
            console.log({
              template,
              err,
              stream,
            });
            stream.pipe(res);
          });
      }
    );
  },
};
