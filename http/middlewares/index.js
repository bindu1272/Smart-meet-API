const AuthMiddleware = require('./auth');
const ApiSecretMiddleware = require('./api-secret');
const GeneralMiddleware = require('./general');
const ResponseMacroMiddleware = require('./responses');
const RequestInterceptorMiddleware = require('./request-interceptor');
const SessionMiddleware = require('./session');
const UserLoginMiddleware = require('./user-login');
const TestMiddleware = require('./test-middleware');
const HasRoleMiddleware = require('./has-role');
const CheckBranchAccessMiddleware = require('./check-branch-access');
const StatusCheckMiddleware = require('./status-check');
const UploadS3 = require('./upload-s3');

// // Policies
// const StudentPolicy = require('./policies/student.policy');
// const AdminPolicy = require('./policies/admin.policy');

module.exports = {
  general: GeneralMiddleware,
  responses: ResponseMacroMiddleware,
  session: SessionMiddleware,
  apiSecret: ApiSecretMiddleware,
  requestInterceptor: RequestInterceptorMiddleware,
  hasRole: HasRoleMiddleware,
  checkBranchAccess: CheckBranchAccessMiddleware,
  uploadS3: UploadS3,

  auth: {
    jwt: AuthMiddleware.jwt,
    statusCheck: StatusCheckMiddleware,
    userLogin: UserLoginMiddleware,
    test: TestMiddleware,
  },
  // policy: {
  //     admin: AdminPolicy,
  //     student: StudentPolicy,
  // }
};
