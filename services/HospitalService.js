const {
  UserRepository,
  HospitalRepository,
  OtpRepository,
  WorkingHourRepository,
  SpecializationRepository,
  FaqRepository,
  CityRepository,
  HospitalUserRepository,
  AdsRepository,
  NotificationsRepository,
  ScreenQuestionsRepository,
  ScreenQuestionsLinkRepository
} = require('../repositories');
const HospitalValidator = require('../validators/HospitalValidator');
const AdsValidator = require('../validators/AdsValidator');
const NotificationsValidator = require('../validators/NotificationsValidator');
const ScreenQuestionsValidator = require('../validators/ScreenQuestionsValidator');
const ValidateHospitalRegistration = require('../tasks/Hospital/ValidateHospitalRegistration');
const ValidateUpdateHospital = require('../tasks/Hospital/ValidateUpdateHospital');
const GenericError = require('../errors/GenericError');
const { Op } = require('sequelize');
const { Ads,Notifications } = require('../models/index');
const getOauthToken = require('../tasks/claim/getOauthToken');
const getLocationId = require('../tasks/claim/getLocationId');

class HospitalService {
  constructor(req) {
    this.userRepo = new UserRepository();
    this.cityRepo = new CityRepository();
    this.hospitalRepo = new HospitalRepository(req);
    this.OtpRepo = new OtpRepository();
    this.hospital = App.lodash.get(req, "user.hospital");
    this.hospitalValidator = new HospitalValidator();
    this.workingHourRepo = new WorkingHourRepository();
    this.specializationRepo = new SpecializationRepository();
    this.faqRepo = new FaqRepository();
    this.hospitalUserRepo = new HospitalUserRepository(req);
    this.adsRepo = new AdsRepository();
    this.notificationsRepo = new NotificationsRepository();
    this.adsValidator = new AdsValidator();
    this.notificationsValidator = new NotificationsValidator();
    this.questionsRepo = new ScreenQuestionsRepository();
    this.questionsValidator = new ScreenQuestionsValidator();
    this.questionsLinkRepo = new ScreenQuestionsLinkRepository();
  }

  async validateHospitalRegistrationEmail(inputs) {
    const user = await this.userRepo.getBy({
      email: App.lodash.get(inputs, "email"),
    });
    if (!user) {
      return {
        user_exist: false,
      };
    } else {
      return {
        user_exist: true,
        user_details: {
          title: user.getData("title"),
          name: user.getData("name"),
          contact_code: user.getData("contact_code"),
          contact_number: user.getData("contact_number"),
          email: user.getData("email"),
        },
      };
    }
  }

  async validateHospital(inputs) {
    await this.hospitalValidator.validate(inputs, "validate-step");
    let user = null;

    if (App.lodash.get(inputs, "step") === 1) {
      user = await this.userRepo.getBy({
        email: App.lodash.get(inputs, "email"),
      });
    }

    await ValidateHospitalRegistration(
      App.lodash.get(inputs, "step"),
      inputs,
      user
    );

    if (App.lodash.get(inputs, "step") === 1) {
      return await this.OtpRepo.sendOtp({
        media_type: App.helpers.config("settings.otp.media_type.email.value"),
        owner: App.lodash.get(inputs, "email"),
        owner_type: App.helpers.config(
          "settings.otp.owner_type.hospital_registration.value"
        ),
      });
    }

    if (App.lodash.get(inputs, "step") === 2) {
      const { message } = await this.OtpRepo.validateOtp(
        App.lodash.get(inputs, "otp_uuid"),
        App.lodash.get(inputs, "otp")
      );

      if (message) {
        throw new GenericError(message);
      }
    }
  }

  async updateHospitalDetails(inputs) {
    await this.hospitalValidator.validate(inputs, "validate-update-step");
    let hospital = await this.hospitalRepo.getBy({
      uuid: App.lodash.get(inputs, "uuid"),
    });
    await ValidateUpdateHospital(
      App.lodash.get(inputs, "step"),
      inputs,
      hospital
    );

    if (App.lodash.get(inputs, "step") === 1) {
      let specialisations = await this.specializationRepo.getFor({
        where: {
          uuid: {
            [Op.in]: App.lodash.get(inputs, "specialisations"),
          },
        },
      });
      let workingHours = await this.workingHourRepo.bulkCreate(
        App.lodash.get(inputs, "working_hours")
      );
      await hospital.setHospital_working_hours(workingHours);
      await hospital.setHospital_specs(specialisations);
      await this.workingHourRepo.clearOrphanEntry();
      const city = await this.cityRepo.getBy({
        uuid: App.lodash.get(inputs, "city_uuid"),
      });
      await this.hospitalRepo.update(
        App.lodash.assign(inputs, {
          city_id: App.lodash.get(city, "id"),
        }),
        {
          where: {
            id: hospital.getData("id"),
          },
        }
      );
      return;
    }
    await this.hospitalRepo.update(inputs, {
      where: {
        id: hospital.getData("id"),
      },
    });
  }
  async registerHospital(inputs) {
    let admin = await this.userRepo.getBy({
      email: App.lodash.get(inputs, "admin.email"),
    });

    if (!admin) {
      await ValidateHospitalRegistration(1, App.lodash.get(inputs, "admin"));
    }
    await ValidateHospitalRegistration(3, App.lodash.get(inputs, "hospital"));
    await ValidateHospitalRegistration(4, App.lodash.get(inputs, "hospital"));

    if (!admin) {
      admin = await this.userRepo.create(
        App.helpers.cloneObj(App.lodash.get(inputs, "admin"), {
          password: await App.helpers.bcryptPassword(
            App.lodash.get(inputs, "admin.password")
          ),
        })
      );
    }

    const city = await this.cityRepo.getBy({
      uuid: App.lodash.get(inputs, "hospital.city_uuid"),
    });
    // const hospitalAgent = await this.hospitalUserRepo.getBy({
    //   uuid : App.lodash.get(inputs,"hospital.hospital_agent"),
    // })
    const hospital = await this.hospitalRepo.create(
      App.lodash.assign(App.lodash.get(inputs, "hospital"), {
        city_id: App.lodash.get(city, "id"),
        // hospital_agent_id: App.lodash.get(hospitalAgent,"id")
      })
    );
    admin.addHospitals(hospital, {
      through: { role_id: App.helpers.config("settings.roles.admin.value") },
    });

    const workignHours = await this.workingHourRepo.bulkCreate(
      App.lodash.get(inputs, "hospital.working_hours", [])
    );

    const specializations = await this.specializationRepo.getFor({
      where: {
        uuid: { [Op.in]: App.lodash.get(inputs, "hospital.specialisations") },
      },
    });
    const oauthToken = await getOauthToken();
    const location_id = await getLocationId(App.lodash.get(inputs, "hospital.address_1"),oauthToken);
    await this.hospitalRepo.update({
      ex_medicare_location_id : location_id},
      {
        where:{
          id : App.lodash.get(hospital,"id")
        }
    })
    await hospital.setHospital_working_hours(workignHours);
    await hospital.addHospital_specs(specializations);
    return hospital;
  }

  async getHosptalList(inputs) {
    return await this.hospitalRepo.searchHospital(inputs);
  }
  async getHospitals(inputs) {
    return await this.hospitalRepo.searchHospital(inputs);
  }

  async getHosptalListFormWeb(inputs) {
    let hospitalDistance = await this.hospitalRepo.rawQuery(
      App.helpers.replaceMultiple(
        App.helpers.config("rawQuery.defaults.get_near_by_hospitals"),
        {
          "{input_lat}": App.lodash.get(inputs, "latitude"),
          "{input_long}": App.lodash.get(inputs, "longitude"),
          "{city_id}": App.lodash.get(inputs, "city.id"),
        }
      )
    );
    let queryObj = App.helpers.cloneObj(inputs, {
      city_id: App.lodash.get(inputs, "city.id"),
    });

    if (
      App.lodash.get(inputs, "sort") &&
      App.lodash.get(inputs, "sort") === "rating"
    ) {
      App.lodash.assign(queryObj, {
        rating: "desc",
      });
    }

    let hospitals = await this.hospitalRepo.searchHospital(queryObj, false);

    hospitals = App.lodash.map(hospitals, (hs) => {
      let hd = App.lodash.find(hospitalDistance, ["id", hs.getData("id")]);
      return App.lodash.assign(hs, {
        dataValues: App.lodash.assign(hs.dataValues, {
          distance: App.lodash.round(App.lodash.get(hd, "distance"), 2),
        }),
      });
    });

    if (
      App.lodash.get(inputs, "sort") &&
      App.lodash.get(inputs, "sort") === "distance"
    ) {
      hospitals = App.lodash.sortBy(hospitals, [
        function (o) {
          return o.dataValues.distance;
        },
      ]);
    }
    return hospitals;
  }

  async updateHospitalStatus(inputs) {
    await this.hospitalValidator.validate(inputs, "update-hospital-status");

    let hospital = await this.hospitalRepo.getBy({
      uuid: App.lodash.get(inputs, "uuid"),
    });

    if (hospital.getData("verified")) {
      throw new GenericError(
        App.helpers.config(
          "messages.errorMessages.hospital.alreadyMarkedActive"
        )
      );
    }
    const payloadToUpdate = {
      verified: App.lodash.get(inputs, "verified"),
      reject_reason: App.lodash.get(inputs, "reject_reason"),
    };

    if (
      App.lodash.get(inputs, "verified") ===
      App.helpers.config("settings.hospital_status.verfied.value")
    ) {
      await this.hospitalValidator.validate(inputs, "bill-details");
      App.lodash.assign(payloadToUpdate, {
        billing_method: App.lodash.get(inputs, "billing_method"),
        billing_unit_amount: App.lodash.get(inputs, "billing_unit_amount"),
      });
    }

    await this.hospitalRepo.update(payloadToUpdate, {
      where: {
        uuid: App.lodash.get(inputs, "uuid"),
      },
    });
    return "Verified";
  }

  async updateHospitalBillingType(inputs) {
    await this.hospitalValidator.validate(inputs, "hospital-exists");
    await this.hospitalValidator.validate(inputs, "bill-details");

    await this.hospitalRepo.update(
      {
        billing_method: App.lodash.get(inputs, "billing_method"),
        billing_unit_amount: App.lodash.get(inputs, "billing_unit_amount"),
      },
      {
        where: {
          uuid: App.lodash.get(inputs, "uuid"),
        },
      }
    );
    return;
  }

  async getSingleHosptalList(inputs) {
    let hospital = await this.hospitalRepo.searchHospital(
      {
        slug: App.lodash.get(inputs, "uuid"),
      },
      false
    );
    return App.lodash.head(hospital);
  }

  async createHospitalFaqs(inputs) {
    const hospital = await this.hospitalRepo.getBy({
      id: this.hospital,
    });
    const newFaq = [];
    const existFaqs = [];
    for(let i=0;i<inputs.length;i++){
      if(App.lodash.get(inputs[i], "uuid")!== undefined &&  App.lodash.get(inputs[i], "uuid")!== null ){
        existFaqs.push({
          uuid : App.lodash.get(inputs[i], "uuid"),
          question: App.lodash.get(inputs[i], "question"),
          answer: App.lodash.get(inputs[i], "answer"),
          owner_id:App.lodash.get(inputs[i], "owner_id")
        })
      }else{
        newFaq.push(inputs[i]);
      }
    }
    if(existFaqs?.length){
      let sample = [];
      for(let faq=0;faq<existFaqs?.length;faq++){
        sample.push({
          question: App.lodash.get(existFaqs[faq], "question"),
          answer: App.lodash.get(existFaqs[faq], "answer"),
        })
        await this.faqRepo.update(
          sample[faq],
          {
            where: {
              uuid: App.lodash.get(existFaqs[faq], "uuid"),
            },
          }
        );
      }
    }
    if(newFaq?.length){
  await this.faqRepo.bulkCreate(
      App.lodash.map(newFaq, (i) => {
        return {
          question: App.lodash.get(i, "question"),
          answer: App.lodash.get(i, "answer"),
          owner_type : "hospital",
          owner_id: App.lodash.get(hospital, "id"),
        };
      })
    );
  }
  }

  async getHospitalFaqs(inputs) {
    const hospital = await this.hospitalRepo.getBy({
      uuid: App.lodash.get(inputs, "uuid"),
    });
    return await hospital.getHospital_faqs();
  }
  async getHospitalAds(inputs) {
    const hospital = await this.hospitalRepo.getBy({
      uuid: App.lodash.get(inputs, "uuid"),
    });
    return await hospital.getHospital_ads();
  }
  async getHospitalAd(inputs) {
    const ads = await this.adsRepo.getBy({
      uuid: App.lodash.get(inputs, "uuid"),
    });
    return ads;
  }
  async getHospitalNotifications(inputs) {
    const hospital = await this.hospitalRepo.getBy({
      uuid: App.lodash.get(inputs, "uuid"),
    });
    return await hospital.getHospital_notifications();
  }
  async getHospitalQuestions(inputs) {
    const hospital = await this.hospitalRepo.getBy({
      uuid : App.lodash.get(inputs,'uuid')
    })
    const hospital_questions = await this.questionsLinkRepo.getFor(
      {
        where : {
          owner_id : App.lodash.get(hospital,'id'),
          owner_type : "hospital"
        }
      }
    );
    return hospital_questions;
  }
  async getHospitalNotification(inputs) {
    const notifications = await this.notificationsRepo.getBy({
      uuid: App.lodash.get(inputs, "uuid"),
    });
    return notifications;
  }

  async getDoctorsHospital(inputs) {
    const data = await this.hospitalUserRepo.getBy({
      user_id: inputs["userId"],
    });
    const hospitalDetails = await this.hospitalRepo.getBy({
      id: data.getData("hospital_id"),
    });
    return hospitalDetails;
  }

  async createHospitalAds(inputs) {
    await this.adsValidator.validate(inputs, "create");
    const hospital = await this.hospitalRepo.getBy({
      id: this.hospital,
    });
    await this.adsRepo.create({
      owner_id: App.lodash.get(hospital, "id"),
      created_by: App.lodash.get(inputs, "createdBy"),
      ...App.lodash.pick(inputs, Ads.fillables)
    });
    await this.adsRepo.clearOrphanEntry();
  }
  async deleteAds(inputs) {
    await this.adsValidator.validate(inputs, "delete");
    return await this.adsRepo.deleteAds(inputs.uuid);
  }
  async updateAds(inputs) {
    await this.adsValidator.validate(inputs, "update-ad");
    await this.adsRepo.update(
      App.lodash.pick(inputs, Ads.fillables),
      {
        where: {
          uuid: App.lodash.get(inputs, "uuid"),
        },
      }
    );
    return;
  }
  async createHospitalNotifications(inputs) {
    await this.notificationsValidator.validate(inputs, "create");
    const hospital = await this.hospitalRepo.getBy({
      id: this.hospital,
    });
    await this.notificationsRepo.create({
      owner_id: App.lodash.get(hospital, "id"),
      created_by: App.lodash.get(inputs, "createdBy"),
      ...App.lodash.pick(inputs, Notifications.fillables),
    });
    await this.notificationsRepo.clearOrphanEntry();
  }
  async createHospitalQuestion(inputs) {
    await this.questionsValidator.validate(inputs, "create");
    const hospital = await this.hospitalRepo.getBy({
      id: this.hospital,
    });
   const screen_question =  await this.questionsRepo.create({
      question: App.lodash.get(inputs, "question"),
      type: App.lodash.get(inputs, "type"),
      options: App.lodash.get(inputs, "options"),
    });
    await this.questionsLinkRepo.create({
      question_id: App.lodash.get(screen_question, "id"),
      owner_id: App.lodash.get(hospital, "id"),
      owner_type: "hospital"
    });
    // await this.questionsRepo.clearOrphanEntry();
  }
  async deleteNotifications(inputs) {
    await this.notificationsValidator.validate(inputs, "delete");
    return await this.notificationsRepo.deleteNotifications(inputs.uuid);
  }
  async updateNotifications(inputs) {
    await this.notificationsValidator.validate(inputs, "update-notification");
    await this.notificationsRepo.update(
      {
        ...App.lodash.pick(inputs, Notifications.fillables)
      },
      {
        where: {
          uuid: App.lodash.get(inputs, "uuid"),
        },
      }
    );
    return;
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
}

module.exports = HospitalService;
