const HospitalAgentController = require('../../app/http/controllers/api/v1/HospitalAgentController');
const superAdminMiddleware = ['auth.jwt', 'hasRole:SuperAdmin'];

module.exports = {
  [`POST hospital-agent/invite`]: {
    action: HospitalAgentController.inviteHospitalAgent,
    name: 'api.inviteHospitalAgent',
    middlewares: [...superAdminMiddleware],
  },
  [`GET hospital-agents`]: {
    action: HospitalAgentController.getHospitalAgents,
    name: 'api.getHospitalAgents',
    middlewares: [],
  },
  [`POST hospital-agent`]: {
    action: HospitalAgentController.registerHospitalAgent,
    name: 'api.registerHospitalAgent',
    middlewares: [],
  },
  [`GET hospital-agent/invitation/:uuid`]: {
    action: HospitalAgentController.getHospitalAgentInvitation,
    name: 'api.getHospitalAgentInvitation',
    middlewares: [],
  },
};
