const {
  UserRepository,
  HospitalRepository,
  HospitalUserRepository,
  AppointmentRepository,
  AppointmentNoteRepository,
  MemberRepository,
} = require('../repositories');
const DoctorValidator = require('../validators/DoctorValidator');
const AppointmentValidator = require('../validators/AppointmentValidator');
const GenericError = require('../errors/GenericError');
const GenerateDoctorStats = require('../tasks/Crons/generateDoctorStats');
const GenerateHospitalStats = require('../tasks/Crons/generateHospitalStats');

// const GenericError = require('../errors/GenericError');

class AppointmentNoteService {
  constructor(req) {
    this.req = req;
    this.user = App.lodash.get(req, 'user.detail');
    this.userRoles = App.lodash.get(req, 'user.roles');
    this.hospital = App.lodash.get(req, 'user.hospital');
    this.hospitalRepo = new HospitalRepository(req);
    this.doctorValidator = new DoctorValidator();
    this.appointmentValidator = new AppointmentValidator();
    this.userRepo = new UserRepository(req);
    this.hospitalUserRepo = new HospitalUserRepository(req);
    this.appointmentRepo = new AppointmentRepository(req);
    this.appointmentNoteRepo = new AppointmentNoteRepository(req);
    this.memberRepo = new MemberRepository(req);
  }
  async validateCall(type = 'add', inputs, doctor_id) {
    if (type === 'add') {
      await this.appointmentValidator.validate(inputs, 'add-appointment-note', {
        hospital_id: this.hospital,
        doctor_id,
      });
    } else {
      await this.appointmentValidator.validate(
        inputs,
        'update-appointment-note',
        {
          hospital_id: this.hospital,
          doctor_id,
        }
      );
    }
  }

  async canLoggedInUserCanUpdateMedicalNotes(type = 'add', inputs) {
    if (
      App.lodash.includes(
        this.userRoles,
        App.helpers.config('settings.roles.doctor.value')
      )
    ) {
      return await this.validateCall(
        type,
        inputs,
        App.lodash.get(this.user, 'id')
      );
    } else {
      let hospitalUser = await this.hospitalUserRepo.getBy({
        hospital_id: this.hospital,
        user_id: App.lodash.get(this.user, 'id'),
        role_id: App.helpers.config('settings.roles.delegate.value'),
      });

      let doctors = await hospitalUser.getDoctors();

      doctors = App.lodash.map(doctors, 'user_id');
      console.log({ type }, inputs);
      let appointment = await this.appointmentRepo.getBy({
        uuid: App.lodash.get(inputs, 'appointment_uuid'),
      });

      if (
        !App.lodash.includes(doctors, App.lodash.get(appointment, 'doctor_id'))
      ) {
        throw new GenericError(
          App.helpers.config(
            'messages.errorMessages.appointmentNotes.notAuthorised'
          )
        );
      }
      return await this.validateCall(
        type,
        inputs,
        App.lodash.get(appointment, 'doctor_id')
      );
    }
  }

  async addAppointmentNote(inputs) {
    await this.canLoggedInUserCanUpdateMedicalNotes('add', inputs);

    let appointment = await this.appointmentRepo.getBy({
      uuid: App.lodash.get(inputs, 'appointment_uuid'),
    });
    await this.appointmentNoteRepo.create({
      notes: inputs,
      appointment_id: appointment.getData('id'),
      user_id: App.lodash.get(this.user, 'id'),
    });
    await this.appointmentRepo.update(
      {
        status: App.helpers.config('settings.appointment_status.done.value'),
      },
      {
        where: {
          id: appointment.getData('id'),
        },
      }
    );
    GenerateDoctorStats(
      App.lodash.get(appointment, 'date'),
      App.lodash.get(appointment, 'hospital_id'),
      App.lodash.get(appointment, 'doctor_id')
    );
    GenerateHospitalStats(
      App.lodash.get(appointment, 'date'),
      App.lodash.get(appointment, 'hospital_id')
    );
    return;
  }

  async updateAppointmentNote(inputs) {
    return await this.appointmentNoteRepo.update(
      {
        notes: App.helpers.objectExcept(inputs, ['uuid']),
        user_id: App.lodash.get(this.user, 'id'),
      },
      {
        where: { uuid: App.lodash.get(inputs, 'uuid') },
      }
    );
  }

  async getPatientMedicalHistory(inputs) {
    await this.appointmentValidator.validate(inputs, 'get-patient-notes');

    let member = await this.memberRepo.getBy({
      uuid: App.lodash.get(inputs, 'uuid'),
    });

    return await this.appointmentNoteRepo.search({
      member_id: App.lodash.get(member, 'id'),
      hospital_id: this.hospital,
    });
  }

  async getMemberMedicalHistory(inputs) {
    let member = null;
    if ('members_uuid' in inputs && inputs['members_uuid']) {
      member = await this.memberRepo.getBy({
        uuid: inputs['members_uuid'],
        user_id: App.lodash.get(this.user, 'id'),
      });
    } else {
      member = await this.memberRepo.getBy({
        user_id: App.lodash.get(this.user, 'id'),
      });
    }

    if (!member) {
      throw new GenericError('Somthing went wrong');
    }
    return await this.appointmentNoteRepo.getMemberMedicalHistory(
      {
        member_id: member.getData('id'),
      },
      true
    );
  }
  async getMedicalHistory(inputs) {
    let member = await this.memberRepo.getBy({
      uuid: App.lodash.get(inputs, 'uuid'),
    });
    let notes = await this.appointmentNoteRepo.getMemberMedicalHistory(
      {
        member_id: App.lodash.get(member, 'id'),
        note_uuid: App.lodash.get(inputs, 'note_uuid'),
      },
      false
    );
    return App.lodash.head(notes);
  }
}
module.exports = AppointmentNoteService;
