const {
  UserRepository,
  MemberRepository,
  AppointmentRepository,
  UserFavouriteRepository,
  HospitalRepository,
  DoctorDetailRepository,
  AdditionalDetailsRepository
} = require('../repositories');
const MemberValidator = require('../validators/MemberValidator');
const AdditionalDetailsValidator = require('../validators/AdditionalDetailsValidator');
const DoctorValidator = require('../validators/DoctorValidator');
const { Member, User, AdditionalDetails } = require('../models/index');

class MemberService {
  constructor(req) {
    this.user = App.lodash.get(req, 'user.detail');
    this.userRepo = new UserRepository();
    this.memberRepo = new MemberRepository();
    this.appointmentRepo = new AppointmentRepository();
    this.memberValidator = new MemberValidator();
    this.doctorValidator = new DoctorValidator();
    this.userFavouriteRepo = new UserFavouriteRepository();
    this.hosptialRepo = new HospitalRepository();
    this.doctorDetailRepo = new DoctorDetailRepository();
    this.additionalDetailsRepo = new AdditionalDetailsRepository();
    this.additionalDetailsValidator = new AdditionalDetailsValidator();
  }

  async getPatientDashboard() {
    let user = await this.userRepo.getBy({
      id: App.lodash.get(this.user, 'id'),
    });

    let members = await this.memberRepo.getFor({
      where: { user_id: App.lodash.get(this.user, 'id') },
    });
    let userDetails = App.lodash.find(members, ['is_primary', true]);
    App.lodash.remove(members, ['is_primary', true]);
    user['userDetails'] = userDetails;
    let membersId = [
      ...App.lodash.map(members, 'id'),
      App.lodash.get(user, 'id'),
    ];

    let stats = await this.appointmentRepo.getPatientAppointmentsStats(
      membersId
    );

    stats = App.lodash.map(stats, (st) => {
      let obj = {
        ...st.dataValues,
        status: App.lodash.find(
          App.helpers.config('settings.appointment_status'),
          ['value', App.lodash.get(st, 'status')]
        ),
      };
      return obj;
    });

    return { user, members, stats };
  }
  async getPatientUuidDashboard(inputs) {
    let userData = await this.userRepo.getBy({
      uuid: App.lodash.get(inputs, 'uuid'),
    });
    let user = await this.userRepo.getBy({
      id: App.lodash.get(userData, 'id'),
    });
    let members = await this.memberRepo.getFor({
      where: { user_id: App.lodash.get(userData, 'id') },
    });
    let userDetails = App.lodash.find(members, ['is_primary', true]);
    App.lodash.remove(members, ['is_primary', true]);
    user['userDetails'] = userDetails;
    let membersId = [
      ...App.lodash.map(members, 'id'),
      App.lodash.get(user, 'id'),
    ];
    let stats = await this.appointmentRepo.getPatientAppointmentsStats(
      membersId
    );

    stats = App.lodash.map(stats, (st) => {
      let obj = {
        ...st.dataValues,
        status: App.lodash.find(
          App.helpers.config('settings.appointment_status'),
          ['value', App.lodash.get(st, 'status')]
        ),
      };
      return obj;
    });

    return { user, members, stats };
  }

  async updatePatientUser(inputs) {
    await this.userRepo.update(App.helpers.objectOnly(inputs, User.fillables), {
      where: {
        id: App.lodash.get(this.user, 'id'),
      },
    },true);
    let members = await this.memberRepo.getFor({
      where: { user_id: App.lodash.get(this.user, 'id') },
    });
    if(members.length < 1 ){
    await this.memberRepo.create(
      App.lodash.assign(App.helpers.objectOnly(inputs, Member.fillables), {
        user_id: App.lodash.get(this.user, 'id'),
          name: App.lodash.get(this.user, 'name'),
          is_primary: true,
      })
    );
    }
    else{
    await this.memberRepo.update(
      App.helpers.objectOnly(inputs, Member.fillables),
      {
        where: {
          user_id: App.lodash.get(this.user, 'id'),
          name: App.lodash.get(this.user, 'name'),
          is_primary: true,
        },
      },true
    );
    }
  }

  async createMember(inputs) {
    await this.memberRepo.create(
      App.lodash.assign(App.helpers.objectOnly(inputs, Member.fillables), {
        user_id: App.lodash.get(this.user, 'id'),
        is_primary: false,
      })
    );
  }
  async createAdditionalDetails(inputs) {
    const user = await this.userRepo.getBy({
      uuid : App.lodash.get(inputs,"user_id")
    })
    await this.additionalDetailsRepo.create({
        user_id : App.lodash.get(user,"id"),
        ...App.lodash.pick(inputs, AdditionalDetails.fillables)
    }
    );
  }
  async getAdditionalDetails(inputs) {
    const userDetails = await this.userRepo.getBy({
      uuid: App.lodash.get(inputs, "userUuid"),
    });
    const additionalDetails = await this.additionalDetailsRepo.getBy({
      user_id:App.lodash.get(userDetails,"id")
    })
    return additionalDetails;
  }
  async updateAdditionalDetails(inputs){
    await this.additionalDetailsValidator.validate(inputs, 'update-details');
    const user = await this.userRepo.getBy({
      uuid : App.lodash.get(inputs,"user_id")
    })
    await this.additionalDetailsRepo.update({
      user_id : App.lodash.get(user,"id"),
      ...App.lodash.pick(inputs, AdditionalDetails.fillables)
    },
       {
      where: {
        uuid: App.lodash.get(inputs, 'uuid'),
      },
    });
  }
  async updateMember(inputs) {
    await this.memberValidator.validate(inputs, 'update-member');
    await this.memberRepo.update(inputs, {
      where: {
        uuid: App.lodash.get(inputs, 'uuid'),
      },
    });
  }

  async markHospitalFavourite(inputs) {
    await this.doctorValidator.validate(inputs, 'mark-hospital-favourite');
    const userDetails = await this.userRepo.getBy({
      uuid: App.lodash.get(inputs?.user, 'id'),
    });
    const hosptial = await this.hosptialRepo.getBy({
      uuid: App.lodash.get(inputs, 'uuid'),
    });
    if (App.lodash.get(inputs, 'action')) {
      await this.userFavouriteRepo.createOrUpdate(
        {
          user_id: App.lodash.get(userDetails, 'id'),
          owner_id: App.lodash.get(hosptial, 'id'),
          owner_type: 'Hospital',
        },
        {
          user_id: App.lodash.get(userDetails, 'id'),
          owner_id: App.lodash.get(hosptial, 'id'),
          owner_type: 'Hospital',
        }
      );
    } else {
      await this.userFavouriteRepo.delete({
        where: {
          user_id: App.lodash.get(userDetails, 'id'),
          owner_id: App.lodash.get(hosptial, 'id'),
          owner_type: 'Hospital',
        },
      });
    }
  }

  async markDoctorFavourite(inputs) {
    // await this.doctorValidator.validate(inputs, 'mark-doctor-favourite');
    const userDetails = await this.userRepo.getBy({
      uuid: App.lodash.get(inputs?.user, 'id'),
    });
    const doctor = await this.doctorDetailRepo.getBy({
      uuid: App.lodash.get(inputs, 'uuid'),
    });
    if (App.lodash.get(inputs, 'action')) {
      await this.userFavouriteRepo.createOrUpdate(
        {
          user_id: App.lodash.get(userDetails, 'id'),
          owner_id: App.lodash.get(doctor, 'id'),
          owner_type: 'Doctor',
        },
        {
          user_id: App.lodash.get(userDetails, 'id'),
          owner_id: App.lodash.get(doctor, 'id'),
          owner_type: 'Doctor',
        }
      );
    } else {
      await this.userFavouriteRepo.delete({
        where: {
          user_id: App.lodash.get(userDetails, 'id'),
          owner_id: App.lodash.get(doctor, 'id'),
          owner_type: 'Doctor',
        },
      });
    }
  }

  async getFavourites(inputs) {
    const user = inputs?.user;
    const users = await this.userRepo.getBy({
      uuid: user?.id,
    });
    const favourites = await this.userFavouriteRepo.getFor({
      user_id: App.lodash.get(users, 'id'),
    });
    const hospitalIds = App.lodash.map(
      App.lodash.filter(favourites, ['owner_type', 'Hospital']),
      'owner_id'
    );

    const DoctorIds = App.lodash.map(
      App.lodash.filter(favourites, ['owner_type', 'Doctor']),
      'owner_id'
    );
    const hospitals = await this.hosptialRepo.searchHospital(
      {
        hospital_ids: hospitalIds,
      },
      false
    );
    const Doctors = await Promise.all(DoctorIds.map(async (doctorId)=>{
    return await this.doctorDetailRepo.getBy({id: doctorId},false)
    }))

    return { Doctors, hospitals };
  }
  async getPatientMembers(){
    return await this.memberRepo.getFor();
  }
}

module.exports = MemberService;
