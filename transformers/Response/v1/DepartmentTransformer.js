const BaseTransformer = require('./BaseTransformer');
const { Department } = require('../../../models');

class DepartmentTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = Department;
  }

  async transform(department) {
    department = await department;
    let returnVal = {
      id: App.lodash.get(department, 'uuid'),
      name: App.lodash.get(department, 'name'),
      email: App.lodash.get(department, 'email'),
      contact_code: App.lodash.get(department, 'contact_code'),
      contact_number: App.lodash.get(department, 'contact_number'),
    };
    return returnVal;
  }
}

module.exports = DepartmentTransformer;
