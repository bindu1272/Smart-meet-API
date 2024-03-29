var CustomValidator = require('../validators/CustomValidator');
/**
 * self calling function to register the custom validators into the package ValidatorJS
 * @return void
 */
(function () {
  CustomValidator.init('unique', 'validateUnique', true);
  CustomValidator.init('unique_in', 'validateUniqueIn', true);
  CustomValidator.init('exist', 'validateIsExist', true);
  CustomValidator.init('existWhere', 'validateIsExistWhere', true);
  CustomValidator.init('exist_in', 'validateExistIn', true);
  CustomValidator.init('not_exist', 'validateNotExist', true);
  CustomValidator.init('not_exist_in', 'validateNotExistIn', true);
  CustomValidator.init('gt', 'validateGreaterThan');
  CustomValidator.init('gte', 'validateGreaterThanEqual');
  CustomValidator.init('lt', 'validateLessThan');
  CustomValidator.init('lte', 'validateLessThanEqual');
  CustomValidator.init(
    'validate_hospital_admin_email',
    'validateHospitalAdminEmail',
    true
  );
  CustomValidator.init('validate_otp', 'validateOtp', true);
  CustomValidator.init('validate_login_staff', 'validateLoginStaff', true);
})();
