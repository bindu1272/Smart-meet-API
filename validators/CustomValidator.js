var ValidatorJS = require('validatorjs');
const _ = App.lodash;
const Models = require('../models');
const { User, HospitalUser } = Models;
const { Op } = require('sequelize');

class CustomValidator {
  static init(ruleName, methodName, async = false) {
    if (async) {
      ValidatorJS.registerAsync(
        ruleName,
        CustomValidator[methodName],
        CustomValidator.messages[ruleName] || null
      );
    } else {
      ValidatorJS.register(
        ruleName,
        CustomValidator[methodName],
        CustomValidator.messages[ruleName] || null
      );
    }
  }

  /**
   * Unique Validation Rule
   *
   * @param  string value
   * @param  string attribute
   * @param  string requirement
   * @param  Object passes
   * @return void
   */
  static validateUnique(value, requirement, attribute, passes) {
    const { isEmpty } = App.helpers;

    let [model, column, exceptParam] = requirement.split(',');

    // const key = isEmpty(column) ? attribute : column;

    let whereObj = {
      [`${attribute}`]: value,
    };

    if (!App.lodash.isUndefined(exceptParam)) {
      const [exceptKey, exceptValue] = exceptParam.split('@');
      whereObj[exceptKey] = { [Op.ne]: exceptValue };
    }

    Models[model]
      .findOne({
        where: whereObj,
      })
      .then((obj) => {
        return App.lodash.isEmpty(obj) ? passes() : passes(false);
      })
      .catch((err) => passes(false));
  }

  static validateUniqueIn(value, requirement, attribute, passes) {
    const { isEmpty } = App.helpers;

    let [model, column, exceptId] = requirement.split(',');

    const key = isEmpty(column) ? attribute : column;

    let whereObj = {
      [`${attribute}`]: value,
    };

    if (!App.lodash.isUndefined(exceptId)) {
      whereObj[key] = exceptId;
    }

    Models[model]
      .findOne({
        where: whereObj,
      })
      .then((obj) => {
        return App.lodash.isEmpty(obj) ? passes() : passes(false);
      })
      .catch((err) => passes(false));
  }

  /**
   * IsExist Validation Rule
   * @param  {[type]} value       [description]
   * @param  {[type]} requirement [description]
   * @param  {[type]} attribute   [description]
   * @param  {[type]} passes      [description]
   * @return {[type]}             [description]
   */
  static validateIsExist(value, requirement, attribute, passes) {
    const { isEmpty } = App.helpers;
    const [model, column, exceptId] = requirement.split(',');
    const key = isEmpty(column) ? attribute : column;

    let whereObj = {
      [`${key}`]: value,
    };

    if (!App.lodash.isUndefined(exceptId)) {
      whereObj['id'] = { '<>': exceptId };
    }

    Models[model]
      .findOne({
        where: whereObj,
      })
      .then((obj) => {
        return isEmpty(obj) ? passes(false) : passes();
      })
      .catch((err) => passes(false));
  }

  /**
   * IsExist Validation Rule
   * @param  {[type]} value       [description]
   * @param  {[type]} requirement [description]
   * @param  {[type]} attribute   [description]
   * @param  {[type]} passes      [description]
   * @return {[type]}             [description]
   */
  static validateIsExistWhere(value, requirement, attribute, passes) {
    const { isEmpty } = App.helpers;
    let [model, column, whereStr] = requirement.split(',');
    const key = isEmpty(column) ? attribute : column;

    let whereObj = {
      [`${key}`]: value,
    };

    if (!App.lodash.isUndefined(whereStr)) {
      whereStr = whereStr.split('@');
      whereObj[`${whereStr[0]}`] = whereStr[1];
    }
    Models[model]
      .findOne({
        where: whereObj,
      })
      .then((obj) => {
        return isEmpty(obj) ? passes(false) : passes();
      })
      .catch((err) => passes(false));
  }

  /**
   * NotExist Validation Rule
   *
   * @param  {[type]} value       [description]
   * @param  {[type]} requirement [description]
   * @param  {[type]} attribute   [description]
   * @param  {[type]} passes      [description]
   * @return {[type]}             [description]
   */
  static validateNotExist(value, requirement, attribute, passes) {
    const { isEmpty } = App.helpers;
    const [model, column, matchingColumn, matchingColumnVal] =
      requirement.split(',');

    Models[model]
      .findOne({
        where: {
          [`${column}`]: value,
          // [`${matchingColumn}`]: matchingColumnVal
        },
      })
      .then((obj) => {
        if (isEmpty(obj)) {
          return passes();
        }

        let customMsg = `The ${column} is already been associated with ${model}.`;

        return passes(false);
      })
      .catch((err) => passes(false));
  }

  static async validateExistIn(value, requirement, attribute, passes) {
    ///required|exist_in:User,uuid,column_name1@value1&&column_name2@value2`

    if (typeof value == 'string') var uniqueEntities = [value];
    else var uniqueEntities = [...new Set(value)];

    let [modelStr, columnName, whereArray] = requirement.split(',');

    let Model = Models[modelStr];

    let whereobj = {
      [`${columnName}`]: {
        [Op.in]: uniqueEntities,
      },
    };

    if (whereArray) {
      whereArray = whereArray.split('&&');

      whereArray.forEach(function (value) {
        var prop = value.split('@');
        whereobj[`${prop[0]}`] = prop[1];
      });
    }

    const uniqueEntitiesCount = await Model.count({
      where: whereobj,
    });

    if (uniqueEntities.length != uniqueEntitiesCount) {
      passes(false);
    }

    passes();
  }

  static async validateNotExistIn(value, requirement, attribute, passes) {
    ///required|not_exist_in:User,uuid,column_name1@value1&&column_name2@value2`

    if (_.isArray(value)) {
      var uniqueEntities = [...new Set(value)];
    } else {
      var uniqueEntities = [value];
    }

    let [modelStr, columnName, whereArray] = requirement.split(',');
    let Model = Models[modelStr];

    let whereobj = {
      [`${columnName}`]: {
        [Op.in]: uniqueEntities,
      },
    };
    if (whereArray) {
      whereArray = whereArray.split('&&');

      whereArray.forEach(function (value) {
        var prop = value.split('@');
        whereobj[`${prop[0]}`] = prop[1];
      });
    }

    const uniqueEntitiesCount = await Model.count({
      where: whereobj,
    });

    if (uniqueEntities.length == uniqueEntitiesCount) {
      passes(false);
    }

    passes();
  }

  static async validateOtp(value, requirement, attribute, passes) {
    // requirement = requirement.split(',');
    // const owner = requirement[0];
    // const owner_type = requirement[1];
    // let Model = Models['Otp'];
    // Model.findOne({});
    // passes();
  }

  static async validateLoginStaff(value, requirement, attribute, passes) {
    if (value === App.env.SUPER_ADMIN_EMAIL) {
      passes(true);
    }

    let user = await User.findOne({
      where: {
        email: value,
      },
    });

    if (!user) {
      passes(
        false,
        App.helpers.config('messages.errorMessages.auth.userNotExist')
      );
    }
    const hospitals = await user.getHospitals();

    if (App.lodash.size(hospitals) === 0) {
      passes(
        false,
        App.helpers.config('messages.errorMessages.auth.noHospitalExists')
      );
    }
    passes(true);
  }

  // static async validateLoginCustomer(value, requirement, attribute, passes) {
  //   let user = await Customer.count({
  //     where: {
  //       email: value,
  //     },
  //   });

  //   if (!user) {
  //     passes(false);
  //   }
  //   passes();
  // }
  static async validateHospitalAdminEmail(
    value,
    requirement,
    attribute,
    passes
  ) {
    let user = await User.find({
      where: {
        email: value,
      },
      include: [
        {
          model: HospitalUser,
        },
      ],
    });

    if (!user) {
      passes(false);
    }
    passes();
  }
}

CustomValidator.messages = {
  unique: 'The :attribute has already been taken.',
  unique_in: 'The :attribute has already been taken.',
  exist: 'The :attribute does not exist.',
  exist_in: 'Some of :attribute does not exist.',
  not_exist: 'The :attribute is already used',
  not_exist_in: 'Some of :attribute does not exist.',
  gt: 'The :attribute must be greater.',
  gte: 'The :attribute must be greater or equal.',
  lt: 'The :attribute must be less.',
  lte: 'The :attribute must be less or equal.',
  crediential_username: App.helpers.config(
    'messages.errorMessages.login.invalidCredentials'
  ),
  crediential_customer: App.helpers.config(
    'messages.errorMessages.login.invalidCredentials'
  ),
};

module.exports = CustomValidator;
