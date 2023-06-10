const BaseTransformer = require("./BaseTransformer");
const { AdditionalDetails } = require("../../../models");

class AdditionalDetailsTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = AdditionalDetails;
  }

  async transform(additionalDetails) {
    additionalDetails = await additionalDetails;
    let returnVal = {
      id: App.lodash.get(additionalDetails, "id"),
      uuid: App.lodash.get(additionalDetails, "uuid"),
      medicare_number: App.lodash.get(additionalDetails, "medicare_number"),
      irn_number: App.lodash.get(additionalDetails, "irn_number"),
      medicare_valid: App.lodash.get(additionalDetails, "medicare_valid"),
      birth_country: App.lodash.get(additionalDetails, "birth_country"),
      cultural_background: App.lodash.get(
        additionalDetails,
        "cultural_background"
      ),
      primary_language: App.lodash.get(additionalDetails, "primary_language"),
      maritial_status: App.lodash.get(additionalDetails, "maritial_status"),
      occupation: App.lodash.get(additionalDetails, "occupation"),
      d_v_a_file_number: App.lodash.get(additionalDetails, "d_v_a_file_number"),
      d_v_a_expiry_date: App.lodash.get(additionalDetails, "d_v_a_expiry_date"),
      pension_card_number: App.lodash.get(
        additionalDetails,
        "pension_card_number"
      ),
      pension_expiry: App.lodash.get(additionalDetails, "pension_expiry"),
      healthcare_card_number: App.lodash.get(
        additionalDetails,
        "healthcare_card_number"
      ),
      healthcare_expiry: App.lodash.get(additionalDetails, "healthcare_expiry"),
      allergy_problems: App.lodash.get(additionalDetails, "allergy_problems"),
      emergency_contacts:App.lodash.get(additionalDetails,"emergency_contacts"),
      user_id: App.lodash.get(additionalDetails, "user_id"),
    };
    return returnVal;
  }
}

module.exports = AdditionalDetailsTransformer;
