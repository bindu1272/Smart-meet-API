const {
  UserRepository,
  OtpRepository,
  AppointmentRepository,
  InvitationLinkRepository,
  MemberRepository,
} = require("../repositories");
const generator = require("generate-password");
const AuthValidator = require("../validators/AuthValidator");
const bcrypt = require("bcrypt");
const admin = require("firebase-admin");
const GenericError = require("../errors/GenericError");
const { User } = require("../models");
const firebaseConfig = require("../../config/firebaseConfig.json");

class AuthService {
  constructor(req) {
    this.userRepo = new UserRepository();
    this.user = App.lodash.get(req, "user.detail");
    this.authValidator = new AuthValidator();
    this.OtpRepo = new OtpRepository();
    this.memberRepo = new MemberRepository();
    this.appointmentRepo = new AppointmentRepository();
    this.invitationRepo = new InvitationLinkRepository();
    if (admin.apps.length == 0) {
      admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
        databaseURL: "",
      });
    }
  }

  async test() {
    await this.appointmentRepo.getAppointmentId();
  }

  async resendOtp(inputs) {
    await this.authValidator.validate(inputs, "resend-otp");
    return await this.OtpRepo.resendOtp(App.lodash.get(inputs, "uuid"));
  }

  async updateUser(inputs) {
    await this.authValidator.validate(inputs, "update-user");

    return await this.userRepo.update(
      App.helpers.objectExcept(inputs, ["email"]),
      {
        where: {
          id: App.lodash.get(this.user, "id"),
        },
      }
    );
  }

  async staffLogin(inputs) {
    let validInputs = await this.authValidator.validate(inputs, "login");

    let user = await this.userRepo.getBy({
      email: App.lodash.get(validInputs, "email"),
    });

    if (!(await bcrypt.compare(validInputs.password, user.getData("password"))))
      throw new GenericError(
        App.helpers.config("messages.errorMessages.auth.invalidCredentials"),
        400
      );

    if (user.getData("email") === App.env.SUPER_ADMIN_EMAIL) {
      return {
        user,
        hospitals: [],
        isSuperAdmin: true,
      };
    }

    const hospitals = await user.getHospitals({
      where: {
        verified: true,
      },
    });

    if (hospitals.length === 0) {
      throw new GenericError(
        App.helpers.config("messages.errorMessages.auth.noHospitalAssigned"),
        400
      );
    }

    return {
      user,
      hospitals,
      isSuperAdmin: false,
    };
  }

  async staffForgotPassword(inputs) {
    await this.authValidator.validate(inputs, "staff-forgot-password");
    let user = await this.userRepo.getBy({
      email: App.lodash.get(inputs, "email"),
    });

    await this.invitationRepo.sendInvitation({
      email: App.lodash.get(user, "email"),
      owner: App.lodash.get(user, "id"),
      owner_type: App.helpers.config(
        "settings.invite_link.owner_type.staff_forgot_password.value"
      ),
      data: { ...user, type: App.lodash.get(inputs, "type") },
    });
  }

  async validateForgotPasswordLink(inputs) {
    await this.authValidator.validate(inputs, "validate-forgot-passsword-link");
    const invitaionLink = await this.invitationRepo.getBy({
      uuid: App.lodash.get(inputs, "uuid"),
      owner_type: App.helpers.config(
        "settings.invite_link.owner_type.staff_forgot_password.value"
      ),
    });
    if (
      invitaionLink.getData("status") !==
      App.helpers.config("settings.invite_link.status.created.value")
    ) {
      throw new GenericError(
        App.helpers.config(
          "messages.errorMessages.auth.invalidForgotPasswordLink"
        )
      );
    }
    return invitaionLink;
  }
  async changeForgotPassword(inputs) {
    await this.authValidator.validate(inputs, "staff-change-password");
    let link = await this.validateForgotPasswordLink(inputs);
    await this.userRepo.update(
      {
        password: await App.helpers.bcryptPassword(
          App.lodash.get(inputs, "password")
        ),
      },
      {
        where: {
          id: App.lodash.get(link, "owner"),
        },
      }
    );
    await this.invitationRepo.markLinkVerfied(App.lodash.get(link, "id"));
  }

  async switchHospital(user, inputs) {
    await this.authValidator.validate(inputs, "switch-hospital");
    const data = { user: user, hospitals: [], currentHospital: {} };
    if (user !== undefined && user !== null) {
      const hospitals = await user.getHospitals();
      data = { ...data, hospitals: hospitals };
      const currentHospital = App.lodash.find(hospitals, [
        "uuid",
        App.lodash.get(inputs, "hospital_uuid"),
      ]);
      data = { ...data, currentHospital: currentHospital };
      if (!currentHospital) {
        throw new GenericError(
          App.helpers.config("messages.errorMessages.auth.noHospitalPermission")
        );
      }
      return data;
    }
    return data;
  }

  async patientLogin(inputs) {
    let validInputs = await this.authValidator.validate(
      inputs,
      "patient-login"
    );
    let user = await this.userRepo.getBy({
      email: App.lodash.get(validInputs, "email"),
    });
    if (!(await bcrypt.compare(validInputs.password, user.getData("password"))))
      throw new GenericError(
        App.helpers.config("messages.errorMessages.auth.invalidCredentials"),
        400
      );
    return {
      user,
    };
  }

  async patientGmailLogin(inputs) {
    await this.authValidator.validate(inputs, "gmail-login");

    let googleUser = await admin
      .auth()
      .verifyIdToken(App.lodash.get(inputs, "token_id"));

    if (App.lodash.get(googleUser, "email_verified", false)) {
      let user = await this.userRepo.getBy({
        email: App.lodash.get(googleUser, "email"),
      });

      if (!user) {
        const password = generator.generate({
          length: 10,
          numbers: true,
        });
        user = await this.userRepo.create({
          email: App.lodash.get(googleUser, "email"),
          name: App.lodash.get(googleUser, "name"),
          password: await App.helpers.bcryptPassword(password),
        });

        await this.memberRepo.create({
          user_id: user.getData("id"),
          name: user.getData("name"),
          is_primary: true,
        });
        this.userRepo.sendUserCredientials(user.getData("email"), password);
        return { user };
      }
      return { user };
    }
  }

  async patientSignUp(inputs) {
    await this.authValidator.validate(inputs, "patient-signup");
    let user = await this.userRepo.getBy({
      email: App.lodash.get(inputs, "email"),
    });
    if (!user) {
      user = await this.userRepo.create(
        App.helpers.cloneObj(App.lodash.pick(inputs, User.fillables), {
          password: await App.helpers.bcryptPassword(
            App.lodash.get(inputs, "password")
          ),
          is_active: false,
        })
      );
    }

    return await this.OtpRepo.sendOtp({
      media_type: App.helpers.config("settings.otp.media_type.email.value"),
      owner: App.lodash.get(inputs, "email"),
      owner_id: user.getData("id"),
      owner_type: App.helpers.config(
        "settings.otp.owner_type.patient_registration.value"
      ),
    });
  }

  async validatePatientSignUp(inputs) {
    await this.authValidator.validate(inputs, "verify-patient-signup");

    let { message, otp } = await this.OtpRepo.validateOtp(
      App.lodash.get(inputs, "otp_uuid"),
      App.lodash.get(inputs, "otp")
    );

    if (message) {
      throw new GenericError(message);
    }

    let user = await this.userRepo.update(
      {
        is_active: true,
      },
      {
        where: {
          id: otp.getData("owner_id"),
        },
      },
      true
    );
    user = App.lodash.head(user);
    return {
      user,
    };
  }

  async destroy(email) {
    await this.userRepo.delete({
      where: { email: email },
    });
    return {
      message: "deleted successfully",
    };
  }
}

module.exports = AuthService;
