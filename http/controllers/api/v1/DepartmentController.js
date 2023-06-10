const DepartmentService = require('../../../../services/DepartmentService');
const {
  DepartmentTransformer,
} = require('../../../../transformers/Response/v1');
const BaseController = require('./BaseController');

module.exports = {
  create: async (req, res) => {
    await new DepartmentService(req).createDepartment(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },

  udpate: async (req, res) => {
    await new DepartmentService(req).updateDepartment(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },

  index: async (req, res) => {
    const departments = await new DepartmentService(req).getDepartments(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );
    const transformedDepartments = await BaseController.getTransformedData(
      req,
      departments,
      DepartmentTransformer
    );
    res.success(transformedDepartments);
  },

  assignDepartmentToDoctor: async (req, res) => {
    await new DepartmentService(req).assignDepartmentToDoctor(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },
  deleteDepartment : async(req,res)=>{
    await new DepartmentService(req).deleteDepartment(
      App.helpers.cloneObj(
        App.lodash.get(req, "params"),
        App.lodash.get(req, "body")
      )
    );
    res.success("deleted record successfully");
  }
};
