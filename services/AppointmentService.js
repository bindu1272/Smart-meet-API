const generator = require('generate-password');
const {
  UserRepository,
  HospitalRepository,
  HospitalUserRepository,
  MemberRepository,
  AppointmentRepository,
  OtpRepository,
  DoctorDetailRepository
} = require('../repositories');
const DoctorValidator = require('../validators/DoctorValidator');
const AppointmentValidator = require('../validators/AppointmentValidator');
const GenericError = require('../errors/GenericError');
const GenerateSlot = require('../tasks/Appointment/GenerateSlots');
const { WorkingHour, DoctorLeave, LeaveHour } = require('../models');
const { Op } = require('sequelize');
const GenerateDoctorStats = require('../tasks/Crons/generateDoctorStats');
const GenerateHospitalStats = require('../tasks/Crons/generateHospitalStats');
const BaseController = require('../http/controllers/api/v1/BaseController');
const SlotTransformer = require("../transformers/Response/v1/SlotTransformer");

class AppointmentService {
  constructor(req) {
    this.req = req;
    this.user = App.lodash.get(req, 'user.detail');
    this.roles = App.lodash.get(req, 'user.roles');
    this.hospital = App.lodash.get(req, 'user.hospital');
    this.hospitalRepo = new HospitalRepository(req);
    this.doctorValidator = new DoctorValidator();
    this.appointmentValidator = new AppointmentValidator();
    this.userRepo = new UserRepository(req);
    this.hospitalUserRepo = new HospitalUserRepository(req);
    this.memberRepo = new MemberRepository(req);
    this.appointmentRepo = new AppointmentRepository(req);
    this.doctorDetailRepo = new DoctorDetailRepository(req);
    this.otpRepo = new OtpRepository(req);
  }

  async getDoctorsAppointments(inputs, validate = true) {
    let doctor = null;
    let hospital = null;
    if (validate) {
      await this.doctorValidator.validate(inputs, 'doctor-slots');
      doctor = await this.userRepo.getBy({
        uuid: App.lodash.get(inputs, 'uuid'),
      });
      hospital = await this.hospitalRepo.getBy({
        uuid: App.lodash.get(inputs, 'hospital_uuid'),
      });
    } else {
      doctor = App.lodash.get(inputs, 'doctor');
      hospital = App.lodash.get(inputs, 'hospital');
    }

    const hospitalUser = await this.hospitalUserRepo.getFor(
      {
        where: {
          user_id: doctor.getData('id'),
          hospital_id: hospital.getData('id'),
        },
      },
      false,
      {
        include: [
          {
            model: WorkingHour,
            as: 'staff_working_hours',
            required: false,
            where: {
              day: App.moment(
                App.lodash.get(inputs, 'date'),
                'YYYY-MM-DD'
              ).day(),
            },
          },
          {
            model: DoctorLeave,
            as: 'hospital_user_leaves',
            required: false,
            where: {
              date: App.lodash.get(inputs, 'date'),
            },
            include: [
              {
                model: LeaveHour,
                as: 'leave_hours',
              },
            ],
          },
        ],
      }
    );
    let appointments = await this.appointmentRepo.getFor({
      where: {
        date: App.lodash.get(inputs, 'date'),
        doctor_id: doctor.getData('id'),
        hospital_id: hospital.getData('id'),
        status: {
          [Op.ne]: App.helpers.config(
            'settings.appointment_status.incomplete.value'
          ),
        },
      },
    });

    let doctorSlots = [];

    App.lodash.map(
      App.lodash.get(hospitalUser, 'staff_working_hours', []),
      (wh) => {
        let generatedSlots = GenerateSlot.doctorSlots(
          App.lodash.get(wh, 'from_time'),
          App.lodash.get(wh, 'to_time'),
          App.lodash.get(hospitalUser, 'slot_duration'),
          appointments,
          App.lodash.head(App.lodash.get(hospitalUser, 'hospital_user_leaves'))
        );
        doctorSlots = [...doctorSlots, ...generatedSlots];
      }
    );
    return doctorSlots;
  }

  async getDoctorsMonthlyAvailabilty(inputs) {
    await this.doctorValidator.validate(inputs, 'doctor-monthly-slots');

    let doctor = await this.userRepo.getBy({
      uuid: App.lodash.get(inputs, 'uuid'),
    });

    let hospital = await this.hospitalRepo.getBy({
      uuid: App.lodash.get(inputs, 'hospital_uuid'),
    });

    const monthStart = App.lodash.get(inputs, 'date')
      ? App.moment(App.lodash.get(inputs, 'date'), 'YYYY-MM-DD')
          .startOf('month')
          .format('YYYY-MM-DD')
      : App.moment().startOf('month').format('YYYY-MM-DD');

    const monthEnd = App.lodash.get(inputs, 'date')
      ? App.moment(App.lodash.get(inputs, 'date'), 'YYYY-MM-DD')
          .endOf('month')
          .format('YYYY-MM-DD')
      : App.moment().endOf('month').format('YYYY-MM-DD');

    const hospitalUser = await this.hospitalUserRepo.getMonthWorkignHours(
      monthStart,
      monthEnd,
      doctor,
      hospital
    );

    let leaves = App.lodash.get(hospitalUser, 'hospital_user_leaves', []);
    let workingHours = App.lodash.get(hospitalUser, 'staff_working_hours', []);

    let appointments = await this.appointmentRepo.getFor({
      where: {
        [Op.and]: [
          {
            date: {
              [Op.gte]: monthStart,
            },
          },
          {
            date: {
              [Op.lte]: monthEnd,
            },
          },
        ],
        doctor_id: doctor.getData('id'),
        hospital_id: hospital.getData('id'),
        status: {
          [Op.ne]: App.helpers.config(
            'settings.appointment_status.incomplete.value'
          ),
        },
      },
    });

    let sDate = App.lodash.get(inputs, 'date')
      ? App.moment(App.lodash.get(inputs, 'date'), 'YYYY-MM-DD').startOf(
          'month'
        )
      : App.moment().startOf('month');

    let eDate = App.lodash.get(inputs, 'date')
      ? App.moment(App.lodash.get(inputs, 'date'), 'YYYY-MM-DD').endOf('month')
      : App.moment().endOf('month');

    let returnArr = [];

    while (sDate.isSameOrBefore(eDate)) {
      let workingHour = App.lodash.filter(workingHours, ['day', sDate.day()]);

      let dayAppointments = App.lodash.filter(appointments, [
        'date',
        sDate.format('YYYY-MM-DD'),
      ]);

      let dayLeaves = App.lodash.find(leaves, [
        'date',
        sDate.format('YYYY-MM-DD'),
      ]);
      let slots = [];

      App.lodash.map(workingHour, (wh) => {
        let generatedSlots = GenerateSlot.doctorSlots(
          App.lodash.get(wh, 'from_time'),
          App.lodash.get(wh, 'to_time'),
          App.lodash.get(hospitalUser, 'slot_duration'),
          dayAppointments,
          dayLeaves
        );
        slots = [...slots, ...generatedSlots];
      });

      returnArr.push({
        date: sDate.format('YYYY-MM-DD'),
        slots,
        leaves: dayLeaves,
        appointments: dayAppointments,
      });

      sDate = sDate.add(1, 'day');
    }
    return returnArr;
  }

  async generateAppointment(member, doctor, hospital, inputs) {
    let slots = await this.getDoctorsAppointments(
      { hospital, doctor, date: App.lodash.get(inputs, 'date') },
      false
    );

    let hasSlot = App.lodash.find(
      slots,
      (s) =>
        !App.lodash.get(s, 'booked') &&
        App.lodash.get(s, 'slot') === App.lodash.get(inputs, 'slot_id')
    );

    if (!hasSlot) {
      throw new GenericError(
        App.helpers.config('messages.errorMessages.appointments.invalidSlots')
      );
    }
    let appointmentId = await this.appointmentRepo.getAppointmentId();
    let appointment = await this.appointmentRepo.create({
      date: App.lodash.get(inputs, 'date'),
      patient_answers: App.lodash.get(inputs,'questionData'),
      appointment_id: appointmentId,
      slot: App.lodash.get(hasSlot, 'slot'),
      type: App.lodash.get(hasSlot, 'type'),
      status: App.helpers.config(
        'settings.appointment_status.incomplete.value'
      ),
      hospital_id: hospital.getData('id'),
      member_id: member.getData('id'),
      doctor_id: doctor.getData('id'),
    });
    return await this.otpRepo.sendOtp({
      media_type: App.helpers.config('settings.otp.media_type.email.value'),
      owner: App.lodash.get(inputs, 'email'),
      owner_id: appointment.getData('id'),
      owner_type: App.helpers.config(
        'settings.otp.owner_type.create_appointment.value'
      ),
    });
  }

  async createAppointment(inputs) {
    await this.appointmentValidator.validate(inputs, 'create-appointment');
    if (
      App.lodash.get(inputs, 'consultation_type') ===
      App.helpers.config('settings.consultationFor.family.value')
    ) {
      await this.appointmentValidator.validate(
        App.lodash.get(inputs, 'patient'),
        'patient-details'
      );
    }
    let user = await this.userRepo.getBy({
      email: App.lodash.get(inputs, 'email'),
    });

    if (!user) {
      user = await this.userRepo.create({
        title: App.lodash.get(inputs, 'title')
          ? App.lodash.get(inputs, 'title')
          : 'Mr',
        name: App.lodash.get(inputs, 'name'),
        email: App.lodash.get(inputs, 'email'),
        contact_code: App.lodash.get(inputs, 'contact_code'),
        contact_number: App.lodash.get(inputs, 'contact_number'),
      });
    }

    let member = null;
    if (
      App.lodash.get(inputs, 'consultation_type') ===
      App.helpers.config('settings.consultationFor.family.value')
    ) {
      member = await this.memberRepo.getBy({
        user_id: user.getData('id'),
        relation: App.lodash.get(inputs, 'patient.relation'),
      });
      if (!member) {
        member = await this.memberRepo.create(
          App.helpers.cloneObj(App.lodash.get(inputs, 'patient'), {
            is_primary: false,
            user_id: user.getData('id'),
          })
        );
      }
      //update member details
    } else {
      member = await this.memberRepo.getBy({
        user_id: user.getData('id'),
        is_primary: true,
      });

      if (!member) {
        member = await this.memberRepo.create({
          user_id: user.getData('id'),
          name: user.getData('name'),
          is_primary: true,
        });
      }
    }

    let doctor = await this.userRepo.getBy({
      uuid: App.lodash.get(inputs, 'doctor_uuid'),
    });

    let hospital = await this.hospitalRepo.getBy({
      uuid: App.lodash.get(inputs, 'hospital_uuid'),
    });

    return await this.generateAppointment(member, doctor, hospital, inputs);
  }

  async createEmergencyAppointment(inputs) {
    let user = await this.userRepo.getBy({
      uuid: App.lodash.get(inputs, 'user_uuid'),
    });

    let member = null;
    if (
      App.lodash.get(inputs, 'consultation_type') ===
      App.helpers.config('settings.consultationFor.family.value')
    ) {
      member = await this.memberRepo.getBy({
        user_id: user.getData('id'),
        relation: App.lodash.get(inputs, 'patient.relation'),
      });
      if (!member) {
        member = await this.memberRepo.create(
          App.helpers.cloneObj(App.lodash.get(inputs, 'patient'), {
            is_primary: false,
            user_id: user.getData('id'),
          })
        );
      }
      //update member details
    } else {
      member = await this.memberRepo.getBy({
        user_id: user.getData('id'),
        is_primary: true,
      });

      if (!member) {
        member = await this.memberRepo.create({
          user_id: user.getData('id'),
          name: user.getData('name'),
          is_primary: true,
        });
      }
    }
    let doctor = await this.userRepo.getBy({
      uuid: App.lodash.get(inputs, 'doctor_uuid'),
    });
   

    let hospital = await this.hospitalRepo.getBy({
      uuid: App.lodash.get(inputs, 'hospital_uuid'),
    });
    let appointmentId = await this.appointmentRepo.getAppointmentId();
    let appointment = await this.appointmentRepo.create({
      date: App.lodash.get(inputs, 'date'),
      appointment_id: appointmentId,
      slot: App.lodash.get(inputs, 'slot'),
      type: App.lodash.get(inputs, 'type'),
      status: App.helpers.config(
        'settings.appointment_status.pending.value'
      ),
      hospital_id: hospital.getData('id'),
      doctor_id: doctor.getData('id'),
      member_id : member.getData('id')
    });
    return await appointment;
  }
  async generateNewUserPassword(appointment) {
    let member = await appointment.getAppointment_member();
    let user = await member.getMember_user();
    if (!user.getData('password')) {
      const password = generator.generate({
        length: 10,
        numbers: true,
      });
      await this.userRepo.update(
        {
          password: await App.helpers.bcryptPassword(password),
        },
        {
          where: {
            id: App.lodash.get(user, 'id'),
          },
        }
      );
      this.userRepo.sendUserCredientials(user.getData('email'), password);
    }
  }

  async validateAppointment(inputs) {
    await this.appointmentValidator.validate(inputs, 'validate-appointment');
    let { message, otp } = await this.otpRepo.validateOtp(
      App.lodash.get(inputs, 'otp_uuid'),
      App.lodash.get(inputs, 'otp')
    );

    if (message) {
      throw new GenericError(message);
    }

    let appointment = await this.appointmentRepo.getBy({
      id: otp.getData('owner_id'),
    });

    if (!appointment) {
      throw new GenericError(
        App.helpers.config(
          'messages.errorMessages.appointments.noAppointmentExists'
        )
      );
    }

    if (
      appointment.getData('status') !==
      App.helpers.config('settings.appointment_status.incomplete.value')
    ) {
      throw new GenericError(
        App.helpers.config(
          'messages.errorMessages.appointments.alreadyVerfiedAppointment'
        )
      );
    }
    await this.generateNewUserPassword(appointment);
    let hospital = await this.hospitalRepo.getBy({
      id : appointment?.hospital_id
    })
    let member = await this.memberRepo.getBy({
      id : appointment?.member_id
    })
    let user = await this.userRepo.getBy({
      id : member?.user_id
    })
    let doctor = await this.userRepo.getBy({
      id : appointment?.doctor_id
    })
    let data = {
      uuid : doctor?.uuid,
      hospital_uuid : hospital?.uuid,
      date : appointment?.date
    }
    let slots = await this.getDoctorsAppointments(data);
    const transformeSlots = await BaseController.getTransformedData(
      this.req,
      slots,
      SlotTransformer
    );
    let filteredSlots = transformeSlots?.filter((slot)=> slot?.id === appointment?.slot);

      const date = new Date(appointment?.date);
      const options = { weekday: 'short', day: '2-digit', month: 'long' };
      const formattedDate = date.toLocaleDateString('en', options);

    await this.otpRepo.appointmentConfirmationMail(user?.email,user?.name,doctor?.name,hospital?.name,formattedDate,filteredSlots?.[0]?.slot_start)

    await this.appointmentRepo.update(
      {
        status: App.helpers.config('settings.appointment_status.pending.value'),
      },
      {
        where: { id: appointment.getData('id') },
      }
    );
    return;
  }

  async getManagerDepartmentDoctorUserIds(manager) {
    let managerHospitalUser = await this.hospitalUserRepo.getBy({
      user_id: App.lodash.get(manager, 'id'),
      hospital_id: this.hospital,
      role_id: App.helpers.config('settings.roles.manager.value'),
    });

    let departments = await managerHospitalUser.getDepartments();

    let doctorHospitalUser = await this.hospitalUserRepo.getDepartmentDoctor(
      departments,
      {
        hospital_id: this.hospital,
      }
    );

    return App.lodash.map(doctorHospitalUser, 'user_id');
  }

  async getDelegateDoctorUserIds(delegate) {
    let delegateHospitalUser = await this.hospitalUserRepo.getBy({
      user_id: App.lodash.get(delegate, 'id'),
      hospital_id: this.hospital,
      role_id: App.helpers.config('settings.roles.delegate.value'),
    });
    let doctorHospitalUsers = await delegateHospitalUser.getDoctors();

    return App.lodash.map(doctorHospitalUsers, 'user_id');
  }

  async getAppointments(inputs) {
    let searchObj = {};
    searchObj['hospital'] = this.hospital;

    if (
      App.lodash.includes(
        this.roles,
        App.helpers.config('settings.roles.admin.value')
      )
    ) {
      searchObj['isAdmin'] = true;
    } else if (
      App.lodash.includes(
        this.roles,
        App.helpers.config('settings.roles.manager.value')
      )
    ) {
      let doctorIds = await this.getManagerDepartmentDoctorUserIds(this.user);
      searchObj['isManager'] = true;
      searchObj['doctor'] = doctorIds;
    } else if (
      App.lodash.includes(
        this.roles,
        App.helpers.config('settings.roles.doctor.value')
      )
    ) {
      searchObj['isDoctor'] = true;
      searchObj['doctor'] = [App.lodash.get(this.user, 'id')];
    } else if (
      App.lodash.includes(
        this.roles,
        App.helpers.config('settings.roles.delegate.value')
      )
    ) {
      // ##########
      searchObj['isDelegate'] = true;
      searchObj['doctor'] = await this.getDelegateDoctorUserIds(this.user);
    }
    searchObj['from_date'] = App.lodash.get(inputs, 'from_date');
    searchObj['to_date'] = App.lodash.get(inputs, 'to_date');
    searchObj['status'] = App.lodash.get(inputs, 'status');
    if (App.lodash.get(inputs, 'query')) {
      searchObj['query'] = App.lodash.get(inputs, 'query');
    }
    return await this.appointmentRepo.search(searchObj);
  }

  async getDoctorLineUp(inputs) {
    await this.doctorValidator.validate(inputs, 'validate-lineup-link');
    const doctor = await this.userRepo.getBy({
      uuid: App.lodash.get(inputs, 'uuid'),
    });
    const hospital = await this.hospitalRepo.getBy({
      uuid: App.lodash.get(inputs, 'hospital_uuid'),
    });
    let slot =
      parseInt(App.moment().format('HH')) * 12 +
      parseInt(App.moment().format('mm')) / 5;
    return await this.appointmentRepo.search(
      {
        from_date: App.moment().format('YYYY-MM-DD'),
        to_date: App.moment().format('YYYY-MM-DD'),
        isDoctor: true,
        hospital: App.lodash.get(hospital, 'id'),
        doctor: [App.lodash.get(doctor, 'id')],
        order_by_slot: true,
        slot: slot,
      },
      false
    );
  }

  async getPatientAppointments(inputs) {
    if('user_uuid' in inputs && inputs['user_uuid']){
      let user = await this.userRepo.getBy(
        {
          uuid : inputs?.user_uuid
        }
      )
      let member = await this.memberRepo.getBy({
        user_id : user?.id
      })
      inputs = {...inputs,member_uuid : member?.uuid}
    }
    return await this.appointmentRepo.patientSearch({
      user_id: App.lodash.get(this.user, 'id'),
      ...inputs,
    });
  }

  async updateAppointment(inputs) {
    await this.appointmentValidator.validate(
      inputs,
      'update-appointment-status',
      {
        hospital_id: this.hospital,
      }
    );

    let appointment = await this.appointmentRepo.update(
      {
        status: App.lodash.get(inputs, 'status'),
        cancel_reason: App.lodash.get(inputs, 'cancel_reason'),
      },
      {
        where: {
          uuid: App.lodash.get(inputs, 'uuid'),
        },
      },
      true
    );
    appointment = App.lodash.head(appointment);
    GenerateDoctorStats(
      App.lodash.get(appointment, 'date'),
      App.lodash.get(appointment, 'hospital_id'),
      App.lodash.get(appointment, 'doctor_id')
    );
    GenerateHospitalStats(
      App.lodash.get(appointment, 'date'),
      App.lodash.get(appointment, 'hospital_id')
    );
  }

  async patientCanceAppointment(inputs) {
    await this.appointmentValidator.validate(inputs, 'cancel-appointment');
    let appointment = await this.appointmentRepo.getBy({
      uuid: App.lodash.get(inputs, 'uuid'),
    });

    if (
      App.lodash.get(appointment, 'status') !==
      App.helpers.config('settings.appointment_status.pending.value')
    ) {
      throw new GenericError(
        App.helpers.config(
          'messages.errorMessages.appointments.noCanceableAppointment'
        )
      );
    }

    await this.appointmentRepo.update(
      {
        status: App.helpers.config(
          'settings.appointment_status.cancelled.value'
        ),
        cancel_reason: App.lodash.get(inputs, 'cancel_reason'),
      },
      {
        where: {
          uuid: App.lodash.get(inputs, 'uuid'),
        },
      },
      true
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
  }

  async rescheduleAppointment(inputs) {
    await this.appointmentValidator.validate(inputs, 'rescheduled-appointment');
    let appointment = await this.appointmentRepo.getBy({
      uuid: App.lodash.get(inputs, 'uuid'),
    });

    let hospital = await this.hospitalRepo.getBy({
      id: appointment.getData('hospital_id'),
    });

    let doctor = await this.userRepo.getBy({
      id: appointment.getData('doctor_id'),
    });

    if (
      appointment.getData('status') ===
      App.helpers.config('settings.appointment_status.done.value')
    ) {
      throw new GenericError(
        App.helpers.config(
          'messages.errorMessages.appointments.alreadyCompleted'
        )
      );
    }

    let slots = await this.getDoctorsAppointments(
      {
        hospital,
        doctor,
        date: App.lodash.get(inputs, 'date'),
      },
      false
    );

    let hasSlot = App.lodash.find(
      slots,
      (s) =>
        !App.lodash.get(s, 'booked') &&
        App.lodash.get(s, 'slot') === App.lodash.get(inputs, 'slot_id')
    );

    if (!hasSlot) {
      throw new GenericError(
        App.helpers.config('messages.errorMessages.appointments.invalidSlots')
      );
    }

    await this.appointmentRepo.update(
      {
        slot: App.lodash.get(inputs, 'slot_id'),
        date: App.lodash.get(inputs, 'date'),
        reschedule_reason: App.lodash.get(inputs, 'reschedule_reason'),
      },
      {
        where: {
          id: appointment.getData('id'),
        },
      }
    );
  }
}
module.exports = AppointmentService;
