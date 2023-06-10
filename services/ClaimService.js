const axios = require("axios");
const sequelize = require("sequelize");
const {
  ClaimRepository,
  AppointmentRepository,
  ClaimTypeRepository,
} = require("../repositories");
const ClaimValidator = require("../validators/ClaimValidator");
const GenericError = require("../errors/GenericError");

class ClaimService {
  constructor(req) {
    this.req = req;
    this.claimRepo = new ClaimRepository();
    this.appointmentRepo = new AppointmentRepository();
    this.claimValidator = new ClaimValidator();
    this.claimTypeRepo = new ClaimTypeRepository();
  }
  async createClaim(inputs) {
    await this.claimValidator.validate(inputs, "create-claim");
    let claimExists = await this.claimRepo.getBy({
      appointment_id: App.lodash.get(inputs, "appointment_id"),
    });
    if (claimExists) {
      throw new GenericError(
        App.helpers.config("messages.errorMessages.claim.alreadyExists")
      );
    }

    let appointment = await this.appointmentRepo.getBy({
      appointment_id: App.lodash.get(inputs, "appointment_id"),
    });
    if (!appointment) {
      throw new GenericError(
        App.helpers.config(
          "messages.errorMessages.appointments.noAppointmentExists"
        )
      );
    }
    let total_amount = 0;
    for(let i=0;i<inputs?.items?.length;i++){
        total_amount = total_amount + inputs?.items[i]?.chargeAmount;
    }
    let claim = await this.claimRepo.create({
      appointment_id: appointment?.id,
      claim_type: App.lodash.get(inputs, "type"),
      service_type: App.lodash.get(inputs, "service_type"),
      start_date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`,
      status: App.helpers.config("settings.claim_status.pending.value"),
      items: JSON.stringify(App.lodash.get(inputs, "items")),
      claimed_amount: total_amount,
    });
    return claim;
  }
  async listClaims(inputs) {
    // await processClaims();
    return await this.claimRepo.getFor();
  }
  async updateClaim(inputs) {
    await this.claimValidator.validate(inputs, "update-claim");
    let total_amount = 0;
    for(let i=0;i<inputs?.items?.length;i++){
        total_amount = total_amount + inputs?.items[i]?.chargeAmount;
    }
    await this.claimRepo.update(
    {
      type: App.lodash.get(inputs, "type"),
      service_type: App.lodash.get(inputs, "service_type"),
      status: App.helpers.config("settings.claim_status.pending.value"),
      items: JSON.stringify(App.lodash.get(inputs, "items")),
      claimed_amount: total_amount,
    },
     {
      where: {
        id: App.lodash.get(inputs, "id"),
      },
    });
    return;
  }
  async createClaimType(inputs) {
    await this.claimValidator.validate(inputs, "create-type");
    let claimType = await this.claimTypeRepo.create({
      type: App.lodash.get(inputs, "type"),
    });
    return claimType;
  }
  async getClaimTypes(inputs) {
    return await this.claimTypeRepo.getFor();
  }
}

module.exports = ClaimService;
