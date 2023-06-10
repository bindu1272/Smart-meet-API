const DoctorService = require('../../../../services/DoctorService');
const DoctorLeaveService = require('../../../../services/DoctorLeaveService');
const BaseController = require('./BaseController');
const {
  UserTransformer,
  HospitalTransformer,
  WorkingHourTransformer,
  DoctorLeaveTransformer,
  PendingInvitationTransformer,
  ScreenQuestionsTransformer,
  ScreenQuestionsLinkTransformer
} = require('../../../../transformers/Response/v1');

module.exports = {
  inviteDoctor: async (req, res) => {
    const link = await new DoctorService(req).inviteDoctor(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.success(link);
  },
  invitations : async (req, res) => {
    const result = await new DoctorService(req).invitations();
    const transformedData = await BaseController.getTransformedData(
      req,
      result,
      PendingInvitationTransformer
    );
    res.success(transformedData);
  },

  validateLink: async (req, res) => {
    const { userExists, asDoctorExists, hospital, data, email } =
      await new DoctorService(req).validateLink(
        App.helpers.cloneObj(
          App.lodash.get(req, 'params'),
          App.lodash.get(req, 'body')
        )
      );
    const transformeHospital = await BaseController.getTransformedData(
      req,
      hospital,
      HospitalTransformer,
      {
        showPartailData: true,
      }
    );
    let transformedUser = data;
    if (userExists) {
      transformedUser = await BaseController.getTransformedData(
        req,
        data,
        UserTransformer
      );
    }
    res.success({
      user_exists: userExists,
      as_doctor_exists: asDoctorExists,
      user: transformedUser,
      hospital: transformeHospital,
      email,
    });
  },

  registerDoctor: async (req, res) => {
    await new DoctorService(req).registerDoctor(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },

  updateDoctor: async (req, res) => {
    await new DoctorService(req).updateDoctor(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },

  adminUpdateDoctor: async (req, res) => {
    await new DoctorService(req).updateDoctor(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      ),
      false
    );
    res.noContent();
  },

  getDoctors: async (req, res) => {
    const { doctors, appointmentStatus } = await new DoctorService(
      req
    ).getDoctors(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );
    const transformeDoctors =
      await BaseController.getTransformedDataWithPagination(
        req,
        doctors,
        UserTransformer,
        {
          appointmentStatus,
          showAppointmentStats: true,
        }
      );
    res.success(transformeDoctors);
  },

  getSingleDoctor: async (req, res) => {
    const doctor = await new DoctorService(req).getSingleDoctor(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    const transformeDoctors = await BaseController.getTransformedData(
      req,
      doctor,
      UserTransformer,
      {
        showFavourites: true,
      }
    );
    res.success(transformeDoctors);
  },

  getHospitalDoctorWorkingHours: async (req, res) => {
    const availability = await new DoctorService(
      req
    ).getHospitalDoctorWorkingHours(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    const transformeWorkingHours = await BaseController.getTransformedData(
      req,
      availability,
      WorkingHourTransformer
    );
    res.success(transformeWorkingHours);
  },

  getHospitalDoctors: async (req, res) => {
    const doctors = await new DoctorService(req).getHospitalDoctors(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );
    const transformeDoctors = await BaseController.getTransformedData(
      req,
      doctors,
      UserTransformer
    );
    res.success(transformeDoctors);
  },

  updateWorkingHours: async (req, res) => {
    await new DoctorService(req).setDoctorWorkingHours(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },

  getWorkingHours: async (req, res) => {
    const { appointment_duration, availability } = await new DoctorService(
      req
    ).getWorkingHours(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    const transformeWorkingHours = await BaseController.getTransformedData(
      req,
      availability,
      WorkingHourTransformer
    );
    res.success({ appointment_duration, availability: transformeWorkingHours });
  },

  createLeave: async (req, res) => {
    const leave = await new DoctorLeaveService(req).createLeave(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },
  udpateLeave: async (req, res) => {
    const leave = await new DoctorLeaveService(req).updateLeave(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'body')
      )
    );
    res.noContent();
  },

  getLeaves: async (req, res) => {
    const leaves = await new DoctorLeaveService(req).getLeaves(
      App.helpers.cloneObj(
        App.lodash.get(req, 'params'),
        App.lodash.get(req, 'query')
      )
    );
    const transformedleaves =
      await BaseController.getTransformedDataWithPagination(
        req,
        leaves,
        DoctorLeaveTransformer
      );
    res.success(transformedleaves);
  },

  getDoctorFaqs: async (req, res) => {
    let faqs = await new DoctorService(req).getDoctorFaqs(
      App.lodash.get(req, 'params')
    );
    res.success(faqs);
  },

  createDoctorFaqs: async (req, res) => {
    await new DoctorService(req).createDoctorFaqs(App.lodash.get(req, 'body'));
    res.noContent();
  },
  deleteDoctor : async(req,res)=>{
    await new DoctorService(req).deleteDoctor(
      App.helpers.cloneObj(
        App.lodash.get(req, "params"),
        App.lodash.get(req, "body")
      )
    );
    res.success("deleted record successfully");
  },
  getAllDoctors : async(req,res)=>{
    let doctors = await new DoctorService(req).getAllDoctors(
      App.helpers.cloneObj(
        App.lodash.get(req, "params"),
        App.lodash.get(req, "body")
      )
    );
    res.success(doctors);
  },
getDoctorQuestions: async (req, res) => {
  let questions = await new DoctorService(req).getDoctorQuestions(
    App.lodash.get(req, 'params')
  );
  let transformedData = await BaseController.getTransformedData(
    req,
    questions,
    ScreenQuestionsLinkTransformer,
  );
  res.success(transformedData);
},
getDoctorandIncludedQuestions: async (req, res) => {
  let questions = await new DoctorService(req).getDoctorandIncludedQuestions(
    App.lodash.get(req, 'params')
  );
  let transformedData = await BaseController.getTransformedData(
    req,
    questions,
    ScreenQuestionsLinkTransformer,
  );
  res.success(transformedData);
},
getDoctorIncludedQuestions: async (req, res) => {
  let questions = await new DoctorService(req).getDoctorIncludedQuestions(
    App.lodash.get(req, 'params')
  );
  let transformedData = await BaseController.getTransformedData(
    req,
    questions,
    ScreenQuestionsLinkTransformer,
  );
  res.success(transformedData);
}, 
getDoctorNotIncludedQuestions: async (req, res) => {
  let questions = await new DoctorService(req).getDoctorNotIncludedQuestions(
    App.lodash.get(req, 'params')
  );
  let transformedData = await BaseController.getTransformedData(
    req,
    questions,
    ScreenQuestionsLinkTransformer,
  );
  res.success(transformedData);
}, 
createDoctorQuestion: async (req, res) => {
  await new DoctorService(req).createDoctorQuestion(
    App.lodash.get(req, 'body')
  );
  res.noContent();
},
includeDoctorQuestions: async (req, res) => {
  await new DoctorService(req).includedDoctorQuestions(
    App.lodash.get(req, 'body')
  );
  res.noContent();
},
deleteQuestion : async(req,res)=>{
  await new DoctorService(req).deleteQuestion(
    App.helpers.cloneObj(
      App.lodash.get(req, "params"),
      App.lodash.get(req, "body")
    )
  );
  res.success("deleted record successfully");
},
updateQuestion: async (req, res) => {
  await new DoctorService(req).updateQuestion(
    App.helpers.cloneObj(
      App.lodash.get(req, 'params'),
      App.lodash.get(req, 'body')
    )
  );
  res.noContent();
},
};
