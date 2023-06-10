const authRoutes = require('./auth-routes');
const hospitalRoutes = require('./hospital-routes');
const doctorRoutes = require('./doctor-routes');
const specialisationRoutes = require('./specialisation-routes');
const appointmentsRoutes = require('./appointment-routes');
const departmentRoutes = require('./department-routes');
const staffRoutes = require('./staff-routes');
const patientRoutes = require('./patient-routes');
const mediaRoutes = require('./media-routes');
const invoiceRoutes = require('./invoice-routes');
const cityRoutes = require('./city-routes');
const contactusRoutes = require('./contact-us-routes');
const hospitalAgentRoutes = require('./hospital-agent-routes');
const claimRoutes = require('./claim-routes');

module.exports = {
  ...authRoutes,
  ...hospitalRoutes,
  ...doctorRoutes,
  ...specialisationRoutes,
  ...appointmentsRoutes,
  ...departmentRoutes,
  ...staffRoutes,
  ...patientRoutes,
  ...mediaRoutes,
  ...invoiceRoutes,
  ...cityRoutes,
  ...contactusRoutes,
  ...hospitalAgentRoutes,
  ...claimRoutes
};
