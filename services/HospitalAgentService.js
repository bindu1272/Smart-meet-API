const {
  UserRepository,
  HospitalRepository,
  InvitationLinkRepository,
  HospitalUserRepository,
} = require("../repositories");
const HospitalAgentValidator = require("../validators/HospitalAgentValidator");
const { User } = require("../models/index");

class HospitalAgentService {
  constructor(req) {
    this.req = req;
    this.user = App.lodash.get(req, "user.detail");
    this.roles = App.lodash.get(req, "user.roles");
    this.hospital = App.lodash.get(req, "user.hospital");
    this.userRepo = new UserRepository(req);
    this.hospitalRepo = new HospitalRepository(req);
    this.hospitalAgentValidator = new HospitalAgentValidator();
    this.invitationLinkRepo = new InvitationLinkRepository(req);
    this.hospitalUserRepo = new HospitalUserRepository();
  }

  async inviteHospitalAgent(inputs) {
    await this.hospitalAgentValidator.validate(inputs, "send-invitation");
    const user = await this.userRepo.getBy({
      email: App.lodash.get(inputs, "email"),
    });
    let currentHospital = await this.hospitalRepo.getBy({
      uuid: App.lodash.get(inputs, "hospitalUuid"),
    });
    if (user) {
      const hospitals = await user.getHospitals();
      const hospitalExists = App.lodash.find(hospitals, [
        "uuid",
        App.lodash.get(inputs, "hospitalUuid"),
      ]);

      // if (
      //   App.lodash.get(hospitalExists, 'HospitalUser.role_id') ===
      //   App.helpers.config('settings.roles.hospitalAgent.value')
      // ) {
      //   throw new GenericError(
      //     App.helpers.config(
      //       'messages.errorMessages.doctor.hospitalAgentAlreadyExists'
      //     )
      //   );
      // }
      ///here user exist and no hospital assigned to him

      return await this.invitationLinkRepo.sendInvitation(
        {
          email: App.lodash.get(inputs, "email"),
          owner: currentHospital?.id,
          owner_type: App.helpers.config(
            "settings.invite_link.owner_type.hospital_agent_registration.value"
          ),
          data: {
            ...App.lodash.get(inputs, "data"),
            hospital_id: App.lodash.get(currentHospital, "id"),
          },
        },
        currentHospital.getData("name")
      );
    }
    if (!user) {
      ///no user exist and no hospital assigned to him
      return await await this.invitationLinkRepo.sendInvitation(
        {
          email: App.lodash.get(inputs, "email"),
          owner: currentHospital?.id,
          owner_type: App.helpers.config(
            "settings.invite_link.owner_type.hospital_agent_registration.value"
          ),
          data: {
            ...App.lodash.get(inputs, "data"),
            hospital_id: App.lodash.get(currentHospital, "id"),
          },
        },
        currentHospital.getData("name")
      );
    }
    return null;
  }
  async sendInvitaionLink(inputs, data) {
    // let hospital = await this.hospitalRepo.getBy({
    //   id: this.hospital,
    // });
    return await this.invitationLinkRepo.sendInvitation(
      {
        email: App.lodash.get(inputs, "email"),
        // owner: this.hospital,
        owner_type: App.helpers.config(
          "settings.invite_link.owner_type.hospital_agent_registration.value"
        ),
        data,
      },
      hospital.getData("name")
    );
  }

  async getHospitalAgents() {
    const hospitalUsers = await this.hospitalUserRepo.getFor({
      where: {
        role_id: App.helpers.config("settings.roles.hospitalAgent.value"),
      },
    });
    return hospitalUsers;
  }
  async registerHospitalAgent(inputs) {
    // await this.staffValidator.validate(inputs, "register-staff-user");

    // const invitaionLink = await this.invitationLinkRepo.getBy({
    //   uuid: App.lodash.get(inputs, "invite_link_uuid"),
    //   owner_type: App.helpers.config(
    //     "settings.invite_link.owner_type.staff_registration.value"
    //   ),
    // });

    // if (
    //   invitaionLink.getData("status") !==
    //   App.helpers.config("settings.invite_link.status.created.value")
    // ) {
    //   throw new GenericError(
    //     App.helpers.config("messages.errorMessages.doctor.expireInviteLink")
    //   );
    // }
    let user = await this.userRepo.create(
      App.helpers.cloneObj(App.lodash.pick(inputs, User.fillables), {
        password: await App.helpers.bcryptPassword(
          App.lodash.get(inputs, "password")
        ),
      })
    );
    await this.hospitalUserRepo.create({
      user_id: App.lodash.get(user, "id"),
      role_id: App.helpers.config("settings.roles.hospitalAgent.value"),
    });
    return "Created Successfully";
  }
  async registerHospitalAg(inputs) {
    await this.doctorValidator.validate(
      inputs,
      "register-hospital-agent-validate-link"
    );
    const invitaionLink = await this.invitationLinkRepo.getBy({
      uuid: App.lodash.get(inputs, "invite_link_uuid"),
      owner_type: App.helpers.config(
        "settings.invite_link.owner_type.hospital_agent_registration.value"
      ),
    });

    if (
      invitaionLink.getData("status") !==
      App.helpers.config("settings.invite_link.status.created.value")
    ) {
      throw new GenericError(
        App.helpers.config("messages.errorMessages.doctor.expireInviteLink")
      );
    }
    let user = null;
    await this.hospitalAgentValidator.validate(inputs, "register-user-details");
    user = await this.userRepo.create(
      App.helpers.cloneObj(App.lodash.pick(inputs, User.fillables), {
        password: await App.helpers.bcryptPassword(
          App.lodash.get(inputs, "password")
        ),
        email: App.lodash.get(invitaionLink, "email"),
      })
    );
    const hospital = await this.hospitalRepo.getBy({
      id: App.lodash.get(invitaionLink, "owner"),
    });
    let data = await user.addHospitals(hospital, {
      through: {
        role_id: App.helpers.config("settings.roles.hospitalAgent.value"),
      },
    });
    await this.setWorkingHours(App.lodash.head(data), inputs);
    await this.invitationLinkRepo.markLinkVerfied(invitaionLink.getData("id"));
  }

  async getHospitalAgentInvitation(inputs) {
    const invitationData = await this.invitationLinkRepo.getBy({
      uuid: App.lodash.get(inputs, "uuid"),
    });
    return invitationData;
  }
}

module.exports = HospitalAgentService;
