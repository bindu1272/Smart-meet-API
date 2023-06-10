const {
  UserRepository,
  InvitationLinkRepository,
  HospitalRepository,
  DepartmentRepository,
  HospitalUserRepository,
} = require("../repositories");
const StaffValidator = require("../validators/StaffValidator");
const ValidateHospitalRegistration = require("../tasks/Hospital/ValidateHospitalRegistration");
const GenericError = require("../errors/GenericError");
const { Op } = require("sequelize");
const { User, AppointmentNote } = require("../models");

class StaffService {
  constructor(req) {
    this.req = req;
    this.user = App.lodash.get(req, "user.detail");
    this.roles = App.lodash.get(req, "user.roles");
    this.hospital = App.lodash.get(req, "user.hospital");
    this.userRepo = new UserRepository(req);
    this.hospitalRepo = new HospitalRepository(req);
    this.invitationLinkRepo = new InvitationLinkRepository(req);
    this.staffValidator = new StaffValidator(req);
    this.departmentRepo = new DepartmentRepository(req);
    this.hospitalUserRepo = new HospitalUserRepository(req);
  }

  async sendInvitaionLink(inputs, data) {
    let hospital = await this.hospitalRepo.getBy({
      id: this.hospital,
    });
    const inviteLink =  await this.invitationLinkRepo.sendInvitation(
      {
        email: App.lodash.get(inputs, "email"),
        owner: this.hospital,
        owner_type: App.helpers.config(
          "settings.invite_link.owner_type.staff_registration.value"
        ),
        data,
      },
      hospital.getData("name")
    );
    return inviteLink;
  }
  async invitations() {
    let searchObj = {};
    searchObj["owner_type"] = App.helpers.config(
      "settings.invite_link.owner_type.staff_registration.value"
    );
    searchObj["status"] = App.helpers.config(
      "settings.invite_link.status.created.value"
    );
    return await this.invitationLinkRepo.getDoctorInvitations(searchObj);
  }

  async checkStaffAlearyExistsExists(role, email, data) {
    let user = await this.userRepo.getBy({
      email,
    });

    if (user) {
      let hospitalUser = await this.hospitalUserRepo.getBy({
        user_id: user.getData("id"),
        hospital_id: App.lodash.get(data, "hospital_id"),
        role_id: role,
      });
      switch (role) {
        case App.helpers.config("settings.roles.admin.value"):
          if (hospitalUser) {
            throw new GenericError(
              App.helpers.config(
                "messages.errorMessages.staffInvition.adminAlreadyExist"
              )
            );
          }
          break;

        case App.helpers.config("settings.roles.manager.value"):
          if (hospitalUser) {
            let departments = await hospitalUser.getDepartments();

            let departmentExists = App.lodash.find(departments, [
              "uuid",
              App.lodash.head(App.lodash.get(data, "departments", [])),
            ]);

            if (departmentExists) {
              throw new GenericError(
                App.helpers.config(
                  "messages.errorMessages.staffInvition.managerAlreadyExist"
                )
              );
            }
          }
          break;
      }
    }
  }

  async inviteStaff(inputs) {
    await this.staffValidator.validate(inputs, "invite-staff");

    // ######## Not for doctors #########
    if (
      App.helpers.config("settings.roles.doctor.value") ===
      App.lodash.get(inputs, "role")
    ) {
      throw new GenericError(
        App.helpers.config("messages.errorMessages.staffInvition.invalidRole")
      );
    }

    // ######## For Admins #########
    if (
      App.helpers.config("settings.roles.admin.value") ===
      App.lodash.get(inputs, "role")
    ) {
      if (
        !App.lodash.includes(
          this.roles,
          App.helpers.config("settings.roles.admin.value")
        )
      ) {
        throw new GenericError(
          App.helpers.config("messages.errorMessages.staffInvition.notAccess")
        );
      }
      await this.checkStaffAlearyExistsExists(
        App.lodash.get(inputs, "role"),
        App.lodash.get(inputs, "email"),
        {
          hospital_id: this.hospital,
          role_id: App.lodash.get(inputs, "role"),
        }
      );
      return await this.sendInvitaionLink(inputs, {
        hospital_id: this.hospital,
        role_id: App.lodash.get(inputs, "role"),
      });
    }

    // ######## For Managers #########
    if (
      App.helpers.config("settings.roles.manager.value") ===
      App.lodash.get(inputs, "role")
    ) {
      if (
        !App.lodash.includes(
          this.roles,
          App.helpers.config("settings.roles.admin.value")
        )
      ) {
        throw new GenericError(
          App.helpers.config("messages.errorMessages.staffInvition.notAccess")
        );
      }

      await this.staffValidator.validate(inputs, "validate-department", {
        hospital_id: this.hospital,
      });

      await this.checkStaffAlearyExistsExists(
        App.lodash.get(inputs, "role"),
        App.lodash.get(inputs, "email"),
        {
          hospital_id: this.hospital,
          role_id: App.lodash.get(inputs, "role"),
          departments: App.lodash.get(inputs, "departments"),
        }
      );
      return await this.sendInvitaionLink(inputs, {
        hospital_id: this.hospital,
        role_id: App.lodash.get(inputs, "role"),
        departments: App.lodash.get(inputs, "departments"),
      });
    }

    // ######## For Delagate #########
    if (
      App.helpers.config("settings.roles.delegate.value") ===
      App.lodash.get(inputs, "role")
    ) {
      if (
        !App.lodash.includes(
          this.roles,
          App.helpers.config("settings.roles.doctor.value")
        )
      ) {
        throw new GenericError(
          App.helpers.config("messages.errorMessages.staffInvition.notAccess")
        );
      }

      return await this.sendInvitaionLink(inputs, {
        hospital_id: this.hospital,
        doctor_id: App.lodash.get(this.user, "id"),
        role_id: App.lodash.get(inputs, "role"),
      });
    }
  }

  async setStaffRole(user, hospital, invitaionLink) {
    switch (App.lodash.get(invitaionLink, "data.role_id")) {
      case App.helpers.config("settings.roles.admin.value"):
        await user.addHospitals(hospital, {
          through: {
            role_id: App.lodash.get(invitaionLink, "data.role_id"),
          },
        });

        break;

      case App.helpers.config("settings.roles.manager.value"):
        let hospitalUser = await this.hospitalUserRepo.getBy({
          user_id: App.lodash.get(user, "id"),
          hospital_id: App.lodash.get(hospital, "id"),
          role_id: App.lodash.get(invitaionLink, "data.role_id"),
        });

        if (!hospitalUser) {
          hospitalUser = await user.addHospitals(hospital, {
            through: {
              role_id: App.lodash.get(invitaionLink, "data.role_id"),
            },
          });

          hospitalUser = App.lodash.head(hospitalUser);
        }
        let departments = await this.departmentRepo.getFor({
          where: {
            uuid: {
              [Op.in]: App.lodash.get(invitaionLink, "data.departments"),
            },
          },
        });

        await hospitalUser.addDepartments(departments);

        break;

      case App.helpers.config("settings.roles.delegate.value"):
        let hospitalDelegate = await user.addHospitals(hospital, {
          through: {
            role_id: App.lodash.get(invitaionLink, "data.role_id"),
          },
        });
        hospitalDelegate = App.lodash.head(hospitalDelegate);
        let hospitalDoctor = await this.hospitalUserRepo.getBy({
          user_id: App.lodash.get(invitaionLink, "data.doctor_id"),
          hospital_id: App.lodash.get(hospital, "id"),
          role_id: App.helpers.config("settings.roles.doctor.value"),
        });

        await hospitalDelegate.addDoctor(hospitalDoctor);

        break;
    }

    await this.invitationLinkRepo.update(
      {
        status: App.helpers.config(
          "settings.invite_link.status.verified.value"
        ),
      },
      {
        where: {
          id: invitaionLink.getData("id"),
        },
      }
    );
  }

  async validateInvitaionLink(inputs) {
    await this.staffValidator.validate(inputs, "validate-link");
    const invitaionLink = await this.invitationLinkRepo.getBy({
      uuid: App.lodash.get(inputs, "uuid"),
      owner_type: App.helpers.config(
        "settings.invite_link.owner_type.staff_registration.value"
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

    let registerSuccess = false;

    let user = await this.userRepo.getBy({
      email: App.lodash.get(invitaionLink, "email"),
    });

    let hospital = await this.hospitalRepo.getBy({
      id: App.lodash.get(invitaionLink, "data.hospital_id"),
    });

    if (user) {
      await this.setStaffRole(user, hospital, invitaionLink);
      registerSuccess = true;
    }
    return {
      registerSuccess,
      hospital,
      email: invitaionLink.getData("email"),
    };
  }

  async registerStaff(inputs) {
    await this.staffValidator.validate(inputs, "register-staff-user");

    const invitaionLink = await this.invitationLinkRepo.getBy({
      uuid: App.lodash.get(inputs, "invite_link_uuid"),
      owner_type: App.helpers.config(
        "settings.invite_link.owner_type.staff_registration.value"
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

    let user = await this.userRepo.create(
      App.helpers.cloneObj(App.lodash.pick(inputs, User.fillables), {
        password: await App.helpers.bcryptPassword(
          App.lodash.get(inputs, "password")
        ),
        email: App.lodash.get(invitaionLink, "email"),
      })
    );
    let hospital = await this.hospitalRepo.getBy({
      id: App.lodash.get(invitaionLink, "data.hospital_id"),
    });
    return await this.setStaffRole(user, hospital, invitaionLink);
  }

  async getAdmins(inputs) {
    return await this.userRepo.searchStaff(
      {
        hospital_id: this.hospital,
        role_id: App.helpers.config("settings.roles.admin.value"),
      },
      false
    );
  }

  async getManager(inputs) {
    let department = await this.departmentRepo.getBy({
      uuid: App.lodash.get(inputs, "department"),
    });
    let managersHospitalUser = await department.getDepartment_users();
    let searchObj = {
      hospital_id: this.hospital,
      hospital_user_id: App.lodash.map(managersHospitalUser, "user_id"),
      role_id: App.helpers.config("settings.roles.manager.value"),
      department_id: App.lodash.get(department, "id"),
    };
    return await this.userRepo.searchStaff(searchObj, false);
  }

  async getDelegates() {
    let doctorHospitalUser = await this.hospitalUserRepo.getBy({
      hospital_id: this.hospital,
      user_id: App.lodash.get(this.user, "id"),
      role_id: App.helpers.config("settings.roles.doctor.value"),
    });

    let delegates = await doctorHospitalUser.getDelegates();
    console.log(App.lodash.map(delegates, "user_id"));
    return await this.userRepo.searchStaff(
      {
        role_id: App.helpers.config("settings.roles.delegate.value"),
        user_ids: App.lodash.map(delegates, "user_id"),
      },
      false
    );
  }

  async removeDelegate(inputs) {
    let doctorHospitalUser = await this.hospitalUserRepo.getBy({
      hospital_id: this.hospital,
      user_id: App.lodash.get(this.user, "id"),
      role_id: App.helpers.config("settings.roles.doctor.value"),
    });

    let delegate = await this.userRepo.getBy({
      uuid: App.lodash.get(inputs, "uuid"),
    });
    let delegateHospitalUser = await this.hospitalUserRepo.getBy({
      hospital_id: this.hospital,
      user_id: App.lodash.get(delegate, "id"),
      role_id: App.helpers.config("settings.roles.delegate.value"),
    });
    await doctorHospitalUser.removeDelegates(delegateHospitalUser);
    return;
  }
  async deleteHospitalAdmin(inputs) {
    return await this.userRepo.deleteHospitalAdmin(inputs.uuid);
  }
}

module.exports = StaffService;
