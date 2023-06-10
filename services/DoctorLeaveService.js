const {
  DoctorLeaveRepository,
  HospitalUserRepository,
  LeaveHourRepository,
  UserRepository,
} = require('../repositories');
const DoctorLeaveValidator = require('../validators/DoctorLeaveValidator');
const GenericError = require('../errors/GenericError');

class DoctorLeaveService {
  constructor(req) {
    this.req = req;
    this.user = App.lodash.get(req, 'user.detail');
    this.userRepo = new UserRepository(req);
    this.hospital = App.lodash.get(req, 'user.hospital');
    this.doctorLeaveRepo = new DoctorLeaveRepository(req);
    this.doctorLeaveValidator = new DoctorLeaveValidator(req);
    this.hospitalUser = new HospitalUserRepository(req);
    this.leaveHourRepo = new LeaveHourRepository(req);
  }

  async createLeave(inputs) {
    await this.doctorLeaveValidator.validate(inputs, 'create-leave');
    let doctor = await this.userRepo.getBy({
      uuid: App.lodash.get(inputs, 'doctor_uuid'),
    });

    let hospitalUser = await this.hospitalUser.getBy({
      hospital_id: this.hospital,
      user_id: App.lodash.get(doctor, 'id'),
    });

    let leaveExists = await this.doctorLeaveRepo.getBy({
      date: App.lodash.get(inputs, 'date'),
      hospital_user_id: hospitalUser.getData('id'),
    });

    if (leaveExists) {
      throw new GenericError(
        App.helpers.config('messages.errorMessages.doctorLeave.alreadyExists')
      );
    }

    let leave = await this.doctorLeaveRepo.create({
      date: App.lodash.get(inputs, 'date'),
      whole_day: App.lodash.get(inputs, 'whole_day'),
      hospital_user_id: hospitalUser.getData('id'),
      reason: App.lodash.get(inputs, 'reason'),
    });
    if (!App.lodash.get(inputs, 'whole_day')) {
      const leaveHours = await this.leaveHourRepo.bulkCreate(
        App.lodash.get(inputs, 'hours')
      );
      await leave.setLeave_hours(leaveHours);
    }
  }

  async updateLeave(inputs) {
    let doctor = await this.userRepo.getBy({
      uuid: App.lodash.get(inputs, 'doctor_uuid'),
    });
    let hospitalUser = await this.hospitalUser.getBy({
      hospital_id: this.hospital,
      user_id: App.lodash.get(doctor, 'id'),
    });
    await this.doctorLeaveValidator.validate(inputs, 'update-leave', {
      hospital_user_id: App.lodash.get(hospitalUser, 'id'),
    });

    let leave = await this.doctorLeaveRepo.update(
      {
        date: App.lodash.get(inputs, 'date'),
        whole_day: App.lodash.get(inputs, 'whole_day'),
        reason: App.lodash.get(inputs, 'reason'),
      },
      {
        where: {
          uuid: App.lodash.get(inputs, 'uuid'),
        },
      },
      true
    );
    leave = App.lodash.head(leave);

    if (!App.lodash.get(inputs, 'whole_day')) {
      const leaveHours = await this.leaveHourRepo.bulkCreate(
        App.lodash.get(inputs, 'hours')
      );
      await leave.setLeave_hours(leaveHours);
    } else {
      leave.setLeave_hours([]);
    }
    this.leaveHourRepo.clearLeaveHours();
    return;
  }

  async getLeaves(inputs) {
    let doctor = await this.userRepo.getBy({
      uuid: App.lodash.get(inputs, 'doctor_uuid'),
    });
    let hospitalUser = await this.hospitalUser.getBy({
      hospital_id: this.hospital,
      user_id: App.lodash.get(doctor, 'id'),
    });

    return await this.doctorLeaveRepo.search({
      hospital_user_id: hospitalUser.getData('id'),
    });
  }
}

module.exports = DoctorLeaveService;
