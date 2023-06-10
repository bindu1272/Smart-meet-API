const {
  UserRepository,
  HospitalAppointmentStatsRepository,
  HospitalUserRepository,
  DoctorAppointmentStatsRepository,
} = require('../repositories');

class DashboardService {
  constructor(req) {
    this.userRepo = new UserRepository();
    this.user = App.lodash.get(req, 'user.detail');
    this.roles = App.lodash.get(req, 'user.roles');
    this.hospital = App.lodash.get(req, 'user.hospital');
    this.hospitalAppointmentStatsRepo =
      new HospitalAppointmentStatsRepository();
    this.hospitalUserRepo = new HospitalUserRepository(req);
    this.doctorAppointmentStatsRepo = new DoctorAppointmentStatsRepository();
  }

  async getDasboardStats(searchObj) {
    if (
      App.lodash.includes(
        this.roles,
        App.helpers.config('settings.roles.superAdmin.value')
      )
    ) {
      return await this.hospitalAppointmentStatsRepo.search({
        ...searchObj,
      });
    } else if (
      App.lodash.includes(
        this.roles,
        App.helpers.config('settings.roles.admin.value')
      )
    ) {
      return await this.hospitalAppointmentStatsRepo.search({
        ...searchObj,
        hospital_id: this.hospital,
      });
    } else if (
      App.lodash.includes(
        this.roles,
        App.helpers.config('settings.roles.doctor.value')
      )
    ) {
      return await this.doctorAppointmentStatsRepo.search({
        ...searchObj,
        hospital_id: this.hospital,
        doctor_id: App.lodash.get(this.user, 'id'),
      });
    } else if (
      App.lodash.includes(
        this.roles,
        App.helpers.config('settings.roles.delegate.value')
      )
    ) {
      let hospitalUser = await this.hospitalUserRepo.getBy({
        hospital_id: this.hospital,
        user_id: App.lodash.get(this.user, 'id'),
        role_id: App.helpers.config('settings.roles.delegate.value'),
      });
      let doctors = await hospitalUser.getDoctors();
      doctors = App.lodash.map(doctors, 'user_id');
      return await this.doctorAppointmentStatsRepo.search({
        ...searchObj,
        hospital_id: this.hospital,
        doctor_id_arr: doctors,
      });
    } else if (
      App.lodash.includes(
        this.roles,
        App.helpers.config('settings.roles.manager.value')
      )
    ) {
      let hospitalUser = await this.hospitalUserRepo.getBy({
        hospital_id: this.hospital,
        user_id: App.lodash.get(this.user, 'id'),
        role_id: App.helpers.config('settings.roles.manager.value'),
      });

      let departments = await hospitalUser.getDepartments();
      let deparmentDoctors = await this.hospitalUserRepo.getDepartmentDoctor(
        departments,
        { hospital_id: this.hospital }
      );
      return await this.doctorAppointmentStatsRepo.search({
        ...searchObj,
        hospital_id: this.hospital,
        doctor_id_arr: App.lodash.map(deparmentDoctors, 'user_id'),
      });
    }
  }
}

module.exports = DashboardService;
