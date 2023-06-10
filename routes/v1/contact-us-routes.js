const ContactUsController = require('../../app/http/controllers/api/v1/ContactUsController');
const superAdminMiddleware = ['auth.jwt', 'hasRole:SuperAdmin'];
const hospitalMiddleware = ['auth.jwt', 'hasRole:Admin,Doctor,Delegate,SuperAdmin'];

const CONTACT_US_ROUTE = 'contactus'
module.exports = {
    [`POST ${CONTACT_US_ROUTE}/staff`] :{
        action : ContactUsController.staffContactUs,
        name : 'api.contactus',
        middlewares : [...hospitalMiddleware],
    },
    [`GET ${CONTACT_US_ROUTE}`]: {
        action: ContactUsController.getAll,
        name: 'api.get',
        middlewares: [...superAdminMiddleware],
    },
    [`DELETE ${CONTACT_US_ROUTE}/:uuid`]: {
        action: ContactUsController.delete,
        name: 'api.deleteComment',
        middlewares: [...superAdminMiddleware],
    },
    [`GET ${CONTACT_US_ROUTE}/:uuid`]: {
        action: ContactUsController.get,
        name: 'api.get',
        middlewares: [...superAdminMiddleware],
    },
    
}