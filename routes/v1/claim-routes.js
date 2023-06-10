const ClaimController = require('../../app/http/controllers/api/v1/ClaimController');
const DoctorAdminMiddleware = ['auth.jwt', 'hasRole:Admin,Doctor'];

module.exports = {
  [`POST create-claimtype`]: {
    action: ClaimController.createClaimType,
    name: 'api.createClaimType',
    middlewares: [],
  },
  [`GET claimtypes`]: {
    action: ClaimController.getClaimTypes,
    name: 'api.getClaimTypes',
    middlewares: [],
  },
  [`POST create-claim`]: {
    action: ClaimController.createClaim,
    name: 'api.createClaim',
    middlewares: [...DoctorAdminMiddleware],
  },
  [`GET claims`]: {
    action: ClaimController.getClaims,
    name: 'api.getClaims',
    middlewares: [...DoctorAdminMiddleware],
  },
  [`PUT claim/:id`]: {
    action: ClaimController.updateClaim,
    name: 'api.ClaimController.updateClaim',
    middlewares: [...DoctorAdminMiddleware],
  },
};
