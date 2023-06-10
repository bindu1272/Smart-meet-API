const {
  UserRepository,
  HospitalRepository,
  OtpRepository,
  WorkingHourRepository,
  AppointmentRepository,
  SpecializationRepository,
  InvitationLinkRepository,
  DoctorDetailRepository,
  HospitalUserRepository,
  DepartmentRepository,
  FaqRepository,
  ScreenQuestionsRepository,
  ScreenQuestionsLinkRepository
} = require('../repositories');
const DoctorValidator = require('../validators/DoctorValidator');
const questionsValidator  = require('../validators/ScreenQuestionsValidator');
const GenericError = require('../errors/GenericError');
const { Op } = require('sequelize');
const { DoctorDetail, User, WorkingHour } = require('../models');
const getOauthToken = require('../tasks/claim/getOauthToken');
const getLocationId = require('../tasks/claim/getLocationId');
const linkProviderToLocation = require('../tasks/claim/linkProviderToLocation');

class DoctorService {
  constructor(req) {
    this.req = req;
    this.user = App.lodash.get(req, 'user.detail');
    this.roles = App.lodash.get(req, 'user.roles');
    this.hospital = App.lodash.get(req, 'user.hospital');
    this.userRepo = new UserRepository(req);
    this.faqRepo = new FaqRepository(req);
    this.hospitalRepo = new HospitalRepository(req);
    this.OtpRepo = new OtpRepository(req);
    this.doctorValidator = new DoctorValidator();
    this.workingHourRepo = new WorkingHourRepository(req);
    this.specializationRepo = new SpecializationRepository(req);
    this.invitationLinkRepo = new InvitationLinkRepository(req);
    this.doctorDetailRepo = new DoctorDetailRepository(req);
    this.hospitalUserRepo = new HospitalUserRepository(req);
    this.departmentRepo = new DepartmentRepository(req);
    this.appointmentRepo = new AppointmentRepository(req);
    this.questionsRepo = new ScreenQuestionsRepository(req);
    this.questionsLinkRepo = new ScreenQuestionsLinkRepository(req);
    this.questionsValidator = new questionsValidator();
  }

  async inviteDoctor(inputs) {
    await this.doctorValidator.validate(inputs, 'send-invitation');
    const user = await this.userRepo.getBy({
      email: App.lodash.get(inputs, 'email'),
    });
    let currentHospital = await this.hospitalRepo.getBy({
      id: this.hospital,
    });

    if (user) {
      const hospitals = await user.getHospitals();
      const hospitalExists = App.lodash.find(hospitals, [
        'id',
        App.lodash.get(this.req, 'user.hospital'),
      ]);

      if (
        App.lodash.get(hospitalExists, 'HospitalUser.role_id') ===
        App.helpers.config('settings.roles.doctor.value')
      ) {
        throw new GenericError(
          App.helpers.config(
            'messages.errorMessages.doctor.doctorAlreadyExists'
          )
        );
      }
      ///here user exist and no hospital assigned to him
      return await this.invitationLinkRepo.sendInvitation(
        {
          email: App.lodash.get(inputs, 'email'),
          owner: App.lodash.get(this.req, 'user.hospital'),
          owner_type: App.helpers.config(
            'settings.invite_link.owner_type.doctor_registration.value'
          ),
          data: App.lodash.get(inputs, 'data'),
        },
        currentHospital.getData('name')
      );
    }
    if (!user) {
      ///no user exist and no hospital assigned to him
      return await await this.invitationLinkRepo.sendInvitation(
        {
          email: App.lodash.get(inputs, 'email'),
          owner: App.lodash.get(this.req, 'user.hospital'),
          owner_type: App.helpers.config(
            'settings.invite_link.owner_type.doctor_registration.value'
          ),
          data: App.lodash.get(inputs, 'data'),
        },
        currentHospital.getData('name')
      );
    }
    return null;
  }
  async invitations(){
    let searchObj = {}
    searchObj["owner_type"] = App.helpers.config(
      'settings.invite_link.owner_type.doctor_registration.value'
    );
    searchObj["status"] =App.helpers.config(
      'settings.invite_link.status.created.value'
    );
   return await this.invitationLinkRepo.getDoctorInvitations(searchObj)
  }
  async validateLink(inputs) {
    await this.doctorValidator.validate(inputs, 'validate-link');
    const invitaionLink = await this.invitationLinkRepo.getBy({
      uuid: App.lodash.get(inputs, 'uuid'),
      owner_type: App.helpers.config(
        'settings.invite_link.owner_type.doctor_registration.value'
      ),
    });

    if (
      invitaionLink.getData('status') !==
      App.helpers.config('settings.invite_link.status.created.value')
    ) {
      throw new GenericError(
        App.helpers.config('messages.errorMessages.doctor.expireInviteLink')
      );
    }
    let userExists = false;
    let asDoctorExists = false;
    let user = await this.userRepo.getBy({
      email: App.lodash.get(invitaionLink, 'email'),
    });
    let hospital = await this.hospitalRepo.getBy({
      id: App.lodash.get(invitaionLink, 'owner'),
    });

    if (user) {
      userExists = true;
      const doctoDetails = await user.getDoctor_detail();
      if (doctoDetails) {
        asDoctorExists = true;
        await user.addHospitals(hospital, {
          through: {
            role_id: App.helpers.config('settings.roles.doctor.value'),
          },
        });
        ///mark link verified
        await this.invitationLinkRepo.update(
          {
            status: App.helpers.config(
              'settings.invite_link.status.verified.value'
            ),
          },
          {
            where: {
              id: invitaionLink.getData('id'),
            },
          }
        );
      }
    }
    return {
      userExists,
      asDoctorExists,
      hospital,
      data: userExists ? user : App.lodash.get(invitaionLink, 'data'),
      email: App.lodash.get(invitaionLink, 'email'),
    };
  }

  async setSpecialisation(user, inputs) {
    const specializations = await this.specializationRepo.getFor({
      where: {
        uuid: { [Op.in]: App.lodash.get(inputs, 'specialisations') },
      },
    });
    user.setUser_specializations(specializations);
  }

  async setWorkingHours(hospitalUser, inputs) {
    const workignHours = await this.workingHourRepo.bulkCreate(
      App.lodash.get(inputs, 'working_hours', [])
    );
    await hospitalUser.setStaff_working_hours(workignHours);
    this.workingHourRepo.clearOrphanEntry();
  }

  async registerDoctor(inputs) {
    await this.doctorValidator.validate(
      inputs,
      'register-doctor-validate-link'
    );
    const invitaionLink = await this.invitationLinkRepo.getBy({
      uuid: App.lodash.get(inputs, 'invite_link_uuid'),
      owner_type: App.helpers.config(
        'settings.invite_link.owner_type.doctor_registration.value'
      ),
    });

    if (
      invitaionLink.getData('status') !==
      App.helpers.config('settings.invite_link.status.created.value')
    ) {
      throw new GenericError(
        App.helpers.config('messages.errorMessages.doctor.expireInviteLink')
      );
    }
    let user = null;
    if (App.lodash.get(inputs, 'user_exists')) {
      await this.doctorValidator.validate(inputs, 'register-doctor-details');
      user = await this.userRepo.getBy({
        email: App.lodash.get(invitaionLink, 'email'),
      });
      await user.createDoctor_detail(
        App.lodash.pick(inputs, DoctorDetail.fillables)
      );
    } else {
      await this.doctorValidator.validate(inputs, 'register-doctor-user');
      await this.doctorValidator.validate(inputs, 'register-doctor-details');
      user = await this.userRepo.create(
        App.helpers.cloneObj(App.lodash.pick(inputs, User.fillables), {
          password: await App.helpers.bcryptPassword(
            App.lodash.get(inputs, 'password')
          ),
          email: App.lodash.get(invitaionLink, 'email'),
        })
      );
      await user.createDoctor_detail(
        App.lodash.pick(inputs, DoctorDetail.fillables)
      );
      const hospital = await this.hospitalRepo.getBy({
        id: App.lodash.get(invitaionLink, 'owner'),
      });
      const oauthToken = await getOauthToken();
      await linkProviderToLocation(user?.name,inputs?.provider_number,oauthToken,hospital?.ex_medicare_location_id);
    }
    const hospital = await this.hospitalRepo.getBy({
      id: App.lodash.get(invitaionLink, 'owner'),
    });
    await this.setSpecialisation(user, inputs);

    let data = await user.addHospitals(hospital, {
      through: { role_id: App.helpers.config('settings.roles.doctor.value') },
    });
    await this.setWorkingHours(App.lodash.head(data), inputs);
    await this.invitationLinkRepo.markLinkVerfied(invitaionLink.getData('id'));
  }

  async updateDoctor(inputs, selfUpdate = true) {
    await this.doctorValidator.validate(inputs, 'update-doctor');
    await this.doctorValidator.validate(inputs, 'register-doctor-details');

    let user = await this.userRepo.update(
      App.lodash.pick(inputs, User.updateFillables),
      {
        where: {
          id: App.lodash.get(this.user, 'id'),
        },
      },
      true
    );

    user = App.lodash.head(user);
    const old_doctor_details = await this.doctorDetailRepo.getBy({
      user_id: App.lodash.get(user, 'id'),
    })
    const oauthToken = await getOauthToken();
    if(old_doctor_details?.provider_number !== inputs?.provider_number){
        await unLinkProviderToLocation(inputs?.provider_number,oauthToken,this.hospital?.ex_medicare_location_id);
    }
    await this.doctorDetailRepo.update(
      App.lodash.pick(inputs, DoctorDetail.fillables),
      {
        where: {
          user_id: App.lodash.get(user, 'id'),
        },
      }
    );
    await linkProviderToLocation(user?.name,inputs?.provider_number,oauthToken,this.hospital?.ex_medicare_location_id);
    await this.setSpecialisation(user, inputs);
  }

  async getDoctors(inputs) {
    let searchObj = { ...inputs, hospital: this.hospital };
    if ('department_uuid' in inputs) {
      let department = await this.departmentRepo.getBy({
        uuid: App.lodash.get(inputs, 'department_uuid'),
        hospital_id: this.hospital,
      });
      let hospitalUsers = await this.hospitalUserRepo.getFor({
      //  department.getDepartment_users({
        // where: {
          role_id: App.helpers.config('settings.roles.doctor.value'),
        // },
      });
      searchObj['hospital_user_ids'] = App.lodash.map(hospitalUsers, 'id');
    } else if (
      App.lodash.includes(
        this.roles,
        App.helpers.config('settings.roles.delegate.value')
      )
    ) {
      let hospitalUser = await this.hospitalUserRepo.getBy({
        user_id: App.lodash.get(this.user, 'id'),
        hospital_id: this.hospital,
        role_id: App.helpers.config('settings.roles.delegate.value'),
      });
      let doctors = await hospitalUser.getDoctors();
      searchObj['hospital_user_ids'] = App.lodash.map(doctors, 'user_id');
    }

    let doctors = await this.userRepo.searchDoctor(searchObj);
    let appointmentStatus =
      await this.appointmentRepo.getDoctorAppointmentStats(
        App.lodash.map(App.lodash.get(doctors, 'data', []), 'id'),
        this.hospital
      );

    return { doctors, appointmentStatus };
  }

  async getSingleDoctor(inputs) {
    let doctor = await this.userRepo.searchDoctor(
      {
        user_uuid: App.lodash.get(inputs, 'uuid'),
      },
      false
    );
    return App.lodash.head(doctor);
  }

  async setDoctorWorkingHours(inputs) {
    await this.doctorValidator.validate(inputs, 'update-working-hours');

    let doctor = await this.userRepo.getBy({
      uuid: App.lodash.get(inputs, 'uuid'),
    });
    let hospitalUser = await this.hospitalUserRepo.update(
      {
        slot_duration: App.lodash.get(inputs, 'appointment_duration'),
      },
      {
        where: {
          user_id: App.lodash.get(doctor, 'id'),
          hospital_id: this.hospital,
        },
      },
      true
    );
    hospitalUser = App.lodash.head(hospitalUser);

    await this.setWorkingHours(hospitalUser, {
      working_hours: App.lodash.get(inputs, 'availability'),
    });
  }

  async getWorkingHours(inputs) {
    await this.doctorValidator.validate(inputs, 'doctor-exists');
    let doctor = await this.userRepo.getBy({
      uuid: App.lodash.get(inputs, 'uuid'),
    });

    const hospitalUser = await this.hospitalUserRepo.getFor(
      {
        where: {
          user_id: App.lodash.get(doctor, 'id'),
          hospital_id: this.hospital,
        },
      },
      false,
      {
        include: [
          {
            model: WorkingHour,
            as: 'staff_working_hours',
            required: false,
          },
        ],
      }
    );
    return {
      appointment_duration: hospitalUser.getData('slot_duration'),
      availability: hospitalUser.getData('staff_working_hours'),
    };
  }

  async getHospitalDoctorWorkingHours(inputs) {
    let hospital = await this.hospitalRepo.getBy({
      uuid: App.lodash.get(inputs, 'hospital_uuid'),
    });
    let user = await this.userRepo.getBy({
      uuid: App.lodash.get(inputs, 'uuid'),
    });
    const hospitalUser = await this.hospitalUserRepo.getFor(
      {
        where: {
          user_id: App.lodash.get(user, 'id'),
          hospital_id: App.lodash.get(hospital, 'id'),
        },
      },
      false,
      {
        include: [
          {
            model: WorkingHour,
            as: 'staff_working_hours',
            required: false,
          },
        ],
      }
    );
    return hospitalUser.getData('staff_working_hours');
  }

  async getHospitalDoctors(inputs) {
    let hospital = await this.hospitalRepo.getBy({
      [Op.or]: [
        { uuid: App.lodash.get(inputs, 'uuid') },
        { slug: App.lodash.get(inputs, 'uuid') },
      ],
    });

    return await this.userRepo.searchDoctor(
      {
        hospital: App.lodash.get(hospital, 'id'),
      },
      false
    );
  }

  async getDoctorForWeb(inputs) {
    return await this.hospitalUserRepo.getDoctorList(inputs, false);
  }

  async createDoctorFaqs(inputs) {
    const doctor = await this.userRepo.getBy({
      id: App.lodash.get(this.user, 'id'),
    });
    let faqs = await this.faqRepo.bulkCreate(
      App.lodash.map(inputs, (i) => {
        return {
          question: App.lodash.get(i, 'question'),
          answer: App.lodash.get(i, 'answer'),
        };
      })
    );
    await doctor.setDoctor_faqs(faqs);
    await this.faqRepo.clearOrphanEntry();
  }

  async getDoctorFaqs(inputs) {
    const user = await this.userRepo.getBy({
      uuid: App.lodash.get(inputs, 'uuid'),
    });
    return await user.getDoctor_faqs();
  }
  async deleteDoctor(inputs) {
    // await this.ContactUsValidator.validate(inputs,'delete');
    return await this.userRepo.deleteDoctor(inputs.uuid);
}
async getAllDoctors(inputs){
  const doctorsData = await this.doctorDetailRepo.getAllDoctors();
  for(let i=0;i<doctorsData?.length;i++){
    const doctor = doctorsData[i]?.getData("doctor");
    doctor["image"] = App.helpers.getImageUrl(doctor.getData("image"));
    doctorsData[i]["doctor"] = doctor;
  }
  return doctorsData;
}
async getDoctorandIncludedQuestions(inputs) {
  const user = await this.userRepo.getBy({
    uuid: App.lodash.get(inputs, "uuid"),
  });
  const doctor = await this.doctorDetailRepo.getBy({
    user_id : App.lodash.get(user,'id')
  })
  const doctor_questions = await this.questionsLinkRepo.getFor(
    {

      where: {
        [Op.or]: [
          {
            owner_id : App.lodash.get(doctor,'id'),
            owner_type : "doctor",
            is_include : null
          },
          {
            owner_id : App.lodash.get(doctor,'id'),
            owner_type : "doctor",
            is_include : true
          },
         
        ],
      },
    }
  );
    return doctor_questions;
}
async getDoctorQuestions(inputs) {
  const user = await this.userRepo.getBy({
    uuid: App.lodash.get(inputs, "uuid"),
  });
  const doctor = await this.doctorDetailRepo.getBy({
    user_id : App.lodash.get(user,'id')
  })
  const doctor_questions = await this.questionsLinkRepo.getFor(
    {
      where: {
            owner_id : App.lodash.get(doctor,'id'),
            owner_type : "doctor",
            is_include : null
          }
    }
  );
    return doctor_questions;
}
async createDoctorQuestion(inputs) {
  await this.questionsValidator.validate(inputs, "create");
  const user = await this.userRepo.getBy({
    uuid: App.lodash.get(inputs,'doctor_user_uuid'),
  });
  const doctor = await this.doctorDetailRepo.getBy({
    user_id : App.lodash.get(user,'id')
  })
  const screen_question = await this.questionsRepo.create({
    question: App.lodash.get(inputs, "question"),
    type: App.lodash.get(inputs, "type"),
    options: App.lodash.get(inputs, "options"),
  });
  await this.questionsLinkRepo.create({
    question_id: App.lodash.get(screen_question, "id"),
      owner_id: App.lodash.get(doctor, "id"),
      owner_type: "doctor"
  })
}
async includedDoctorQuestions(inputs) {
  // await this.questionsValidator.validate(inputs, "create");
  const user = await this.userRepo.getBy({
    uuid: App.lodash.get(inputs,'doctor_user_uuid'),
  });
  const doctor = await this.doctorDetailRepo.getBy({
    user_id : App.lodash.get(user,'id')
  })
  const hospital = await this.hospitalRepo.getBy({
    uuid : App.lodash.get(inputs,'hospital_uuid')
  })
  const screen_questions = await this.questionsRepo.getFor({
    where:{
      uuid : {
        [Op.in] : App.lodash.get(inputs,'includedQuestions')
      }
    }
  });
  for (let i = 0; i < screen_questions?.length; i++) {
     const question = await this.questionsLinkRepo.getFor({
        where: {
          [Op.and]: [
            { question_id: App.lodash.get(screen_questions[i], "id") },
            { owner_id: App.lodash.get(doctor, "id") },
            { owner_type: "doctor" },
            {is_include:true}
          ],
        },
      });
    if (!question?.length) {
      await this.questionsLinkRepo.create({
        question_id: App.lodash.get(screen_questions[i], "id"),
        owner_id: App.lodash.get(doctor, "id"),
        owner_type: "doctor",
        is_include: true,
      });
    }
  }
  const not_screen_questions = await this.questionsRepo.getFor({
    where:{
      uuid : {
        [Op.in] : App.lodash.get(inputs,'notIncludedQuestions')
      }
    }
  });
  for (let i = 0; i < not_screen_questions?.length; i++) {
     const question = await this.questionsLinkRepo.getFor({
        where: {
          [Op.and]: [
            { question_id: App.lodash.get(not_screen_questions[i], "id") },
            { owner_id: App.lodash.get(doctor, "id") },
            { owner_type: "doctor" },
            {is_include:true}
          ],
        },
      });
    if (question?.length>0) {
      await this.questionsLinkRepo.deleteQuestionLinkByUuid(App.lodash.get(question?.[0],'uuid'));
    }
  }
}

async deleteQuestion(inputs) {
  await this.questionsValidator.validate(inputs, "delete");
  const question = await this.questionsRepo.getBy({
    uuid : App.lodash.get(inputs,'uuid')
  })
  await this.questionsRepo.deleteScreenQuestion(inputs.uuid);
  await this.questionsLinkRepo.deleteQuestionLink(question?.id);
  return "Deleted Successfully";
}
async updateQuestion(inputs) {
  await this.questionsValidator.validate(inputs, "update-question");
  await this.questionsRepo.update(
    {
      question: App.lodash.get(inputs, "question"),
      type: App.lodash.get(inputs, "type"),
      options: App.lodash.get(inputs, "options"),
    },
    {
      where: {
        uuid: App.lodash.get(inputs, "uuid"),
      },
    }
  );
  return;
}
async getDoctorIncludedQuestions(inputs){
  const user = await this.userRepo.getBy({
    uuid: App.lodash.get(inputs, "doctor_uuid"),
  });
  const doctor = await this.doctorDetailRepo.getBy({
    user_id : App.lodash.get(user,'id')
  })
  const doctor_questions = await this.questionsLinkRepo.getFor(
    {
      where : {
        owner_id : App.lodash.get(doctor,'id'),
        owner_type : "doctor",
        is_include : true,
      }
    }
  );
    return doctor_questions;

}
async getDoctorNotIncludedQuestions(inputs){
  const user = await this.userRepo.getBy({
    uuid: App.lodash.get(inputs, "doctor_uuid"),
  });
  const doctor = await this.doctorDetailRepo.getBy({
    user_id : App.lodash.get(user,'id')
  })
  const doctor_questions = await this.questionsLinkRepo.getFor(
    {
      where : {
        owner_id : App.lodash.get(doctor,'id'),
        owner_type : "doctor",
        is_include : false,
      }
    }
  );
    return doctor_questions;

}

async getDoctorUserId(inputs){
  const user = await this.userRepo.getBy({
    uuid: App.lodash.get(inputs, "doctor_uuid"),
  });
    return user?.id;
}
}

module.exports = DoctorService;
