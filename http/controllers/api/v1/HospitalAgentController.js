const HospitalAgentService = require('../../../../services/HospitalAgentService');
const {
  HospitalAgentTransformer, InvitationLinkTransformer
} = require('../../../../transformers/Response/v1');
const BaseController = require('./BaseController');


module.exports = {
  inviteHospitalAgent: async (req, res) => {
    const link = await new HospitalAgentService(req).inviteHospitalAgent(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.success(link);
  },
  getHospitalAgents: async (req, res) => {
    const data = await new HospitalAgentService(req).getHospitalAgents(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );
    const transformedData = await BaseController.getTransformedData(
      req,
      data,
      HospitalAgentTransformer
    );
    res.success(transformedData);
  },
  registerHospitalAgent: async (req, res) => {
    await new HospitalAgentService(req).registerHospitalAgent(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },
  getHospitalAgentInvitation: async (req, res) => {
    const data = await new HospitalAgentService(req).getHospitalAgentInvitation(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );
    const transformedData = await BaseController.getTransformedData(
      req,
      data,
      InvitationLinkTransformer
    );
    res.success(transformedData);
  },


};
